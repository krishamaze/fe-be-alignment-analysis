from decimal import Decimal


def compute_gst(subtotal: Decimal, cgst_rate=0, sgst_rate=0, igst_rate=0):
    subtotal = Decimal(subtotal)
    cgst = subtotal * Decimal(cgst_rate) / Decimal(100)
    sgst = subtotal * Decimal(sgst_rate) / Decimal(100)
    igst = subtotal * Decimal(igst_rate) / Decimal(100)
    total = subtotal + cgst + sgst + igst
    return (
        cgst.quantize(Decimal("0.01")),
        sgst.quantize(Decimal("0.01")),
        igst.quantize(Decimal("0.01")),
        total.quantize(Decimal("0.01")),
    )


def validate_hsn(code: str) -> bool:
    """Basic placeholder validation for HSN codes."""
    return code.isdigit() and len(code) in (4, 6, 8)
