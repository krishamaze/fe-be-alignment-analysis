import { useState, useEffect, useMemo } from 'react';
import { useCreateSaleInvoiceMutation, useSearchSaleProductsQuery } from '../../api/erpApi';
import { toast } from 'react-hot-toast';
import { useDebounce } from 'use-debounce';

const CreateSaleInvoice = () => {
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([
    { productId: null, productName: '', quantity: 1, rate: 0, unit: '', amount: 0, searchTerm: '' },
  ]);
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState({});
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);

  const [debouncedSearchTerm] = useDebounce(
    activeSearchIndex !== null ? items[activeSearchIndex]?.searchTerm : '',
    300
  );

  const [createInvoice, { isLoading }] = useCreateSaleInvoiceMutation();
  const { data: products, isFetching } = useSearchSaleProductsQuery(
    { search: debouncedSearchTerm },
    { skip: !debouncedSearchTerm || activeSearchIndex === null }
  );

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = (newItems[index].quantity || 0) * (newItems[index].rate || 0);
    }
    if (field === 'searchTerm') {
      setActiveSearchIndex(index);
    }
    setItems(newItems);
  };

  const handleProductSelect = (index, product) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId: product.id,
      productName: `${product.product_name} - ${product.quality}`,
      rate: product.rate,
      unit: product.unit,
      amount: newItems[index].quantity * product.rate,
      searchTerm: '',
    };
    setItems(newItems);
    setActiveSearchIndex(null);
  };

  const addRow = () => {
    setItems([...items, { productId: null, productName: '', quantity: 1, rate: 0, unit: '', amount: 0, searchTerm: '' }]);
  };

  const removeRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    if (newItems.length === 0) {
      setItems([{ productId: null, productName: '', quantity: 1, rate: 0, unit: '', amount: 0, searchTerm: '' }]);
    } else {
      setItems(newItems);
    }
  };

  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);
  const grandTotal = useMemo(() => totalAmount - discount, [totalAmount, discount]);

  const validate = () => {
    const newErrors = {};
    if (!customerName || customerName.length < 2) newErrors.customerName = 'Customer name is required (min 2 chars)';
    if (!mobile || !/^\d{10}$/.test(mobile)) newErrors.mobile = 'A valid 10-digit mobile number is required';
    if (items.some(item => !item.productId)) newErrors.items = 'All items must have a product selected';
    if (items.some(item => item.quantity < 1)) newErrors.items = 'Quantity must be at least 1 for all items';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    const payload = {
      customer_name: customerName,
      mobile,
      invoice_date: invoiceDate,
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      })),
      total_amount: totalAmount,
      discount,
      grand_total: grandTotal,
    };

    try {
      await createInvoice(payload).unwrap();
      toast.success('Invoice created successfully!');
      // Reset form
      setCustomerName('');
      setMobile('');
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setItems([{ productId: null, productName: '', quantity: 1, rate: 0, unit: '', amount: 0, searchTerm: '' }]);
      setDiscount(0);
      setErrors({});
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create invoice.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create Sale Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              id="customer_name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            <input
              id="mobile"
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
          </div>
          <div>
            <label htmlFor="invoice_date" className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
            <input
              id="invoice_date"
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search for a product..."
                          value={item.searchTerm || item.productName || ''}
                          onChange={(e) => handleItemChange(index, 'searchTerm', e.target.value)}
                          onFocus={() => setActiveSearchIndex(index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        {isFetching && activeSearchIndex === index && <p>Loading...</p>}
                        {products && activeSearchIndex === index && (
                          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                            {products.map(p => (
                              <li
                                key={p.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleProductSelect(index, p)}
                              >
                                {p.product_name} - {p.quality}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.rate.toFixed(2)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.amount.toFixed(2)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {errors.items && <p className="text-red-500 text-xs mt-1">{errors.items}</p>}
          <button
            type="button"
            onClick={addRow}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Row
          </button>
        </div>

        <div className="flex justify-end mt-6">
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span>{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="discount" className="text-gray-600">Discount</label>
              <input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Grand Total</span>
              <span>{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSaleInvoice;