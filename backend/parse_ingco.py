
import openpyxl, json, base64, io

wb = openpyxl.load_workbook('./INGCO_TARIFS_MAI_2026__1_.xlsx')
ws = wb.active

image_map = {}
for img in ws._images:
    anchor = img.anchor
    if hasattr(anchor, '_from') and anchor._from.col == 1:
        row = anchor._from.row
        try:
            buf = img.ref.getvalue() if hasattr(img.ref, 'getvalue') else bytes(img.ref)
            image_map[row] = base64.b64encode(buf).decode()
        except:
            pass

products = []
for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True)):
    code_bar = str(int(float(str(row[0])))) if row[0] else None
    name_fr  = str(row[3]).strip() if row[3] else (str(row[2]).strip() if row[2] else None)
    unit     = str(row[4]).strip() if row[4] else 'PCS'

    try:
        qty = int(float(str(row[5]))) if row[5] else None
    except:
        qty = None

    try:
        price = float(str(row[6]).replace(',', '.').replace(' ', '').replace('\u20ac',''))
    except:
        price = 0

    image_b64 = image_map.get(i + 1)

    if not name_fr:
        continue

    products.append({
        "code_bar": code_bar,
        "name": name_fr,
        "unit": unit,
        "stock": qty,
        "price": price,
        "image_b64": image_b64
    })

print(json.dumps(products, ensure_ascii=False))
