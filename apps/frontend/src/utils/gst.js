export function computeGST(subtotal, { cgst = 0, sgst = 0, igst = 0 } = {}) {
  const s = Number(subtotal) || 0;
  const cgstAmt = (s * cgst) / 100;
  const sgstAmt = (s * sgst) / 100;
  const igstAmt = (s * igst) / 100;
  const total = s + cgstAmt + sgstAmt + igstAmt;
  return {
    cgst: Number(cgstAmt.toFixed(2)),
    sgst: Number(sgstAmt.toFixed(2)),
    igst: Number(igstAmt.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}
