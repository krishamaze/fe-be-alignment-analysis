import { useState } from 'react';
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from '../api/erpApi';
import toast from 'react-hot-toast';

export default function TaxonomyDashboard() {
  const {
    data: deptData,
    isLoading: deptLoading,
    error: deptError,
  } = useGetDepartmentsQuery();
  const [createDept] = useCreateDepartmentMutation();
  const [updateDept] = useUpdateDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();
  const [deptForm, setDeptForm] = useState({ slug: null, name: '' });

  const {
    data: catData,
    isLoading: catLoading,
    error: catError,
  } = useGetCategoriesQuery();
  const [createCat] = useCreateCategoryMutation();
  const [updateCat] = useUpdateCategoryMutation();
  const [deleteCat] = useDeleteCategoryMutation();
  const [catForm, setCatForm] = useState({
    slug: null,
    name: '',
    department: '',
  });

  const {
    data: subData,
    isLoading: subLoading,
    error: subError,
  } = useGetSubCategoriesQuery();
  const [createSub] = useCreateSubCategoryMutation();
  const [updateSub] = useUpdateSubCategoryMutation();
  const [deleteSub] = useDeleteSubCategoryMutation();
  const [subForm, setSubForm] = useState({
    slug: null,
    name: '',
    category: '',
  });

  const handleDeptChange = (e) => {
    setDeptForm({ ...deptForm, [e.target.name]: e.target.value });
  };
  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      if (deptForm.slug) {
        await updateDept({
          slug: deptForm.slug,
          body: { name: deptForm.name },
        }).unwrap();
        toast.success('Department updated');
      } else {
        await createDept({ name: deptForm.name }).unwrap();
        toast.success('Department created');
      }
      setDeptForm({ slug: null, name: '' });
    } catch {
      toast.error('Failed to save department');
    }
  };
  const handleDeptEdit = (d) => setDeptForm({ slug: d.slug, name: d.name });
  const handleDeptDelete = async (slug) => {
    try {
      await deleteDept(slug).unwrap();
      toast.success('Department deleted');
    } catch {
      toast.error('Failed to delete department');
    }
  };

  const handleCatChange = (e) => {
    setCatForm({ ...catForm, [e.target.name]: e.target.value });
  };
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    const body = { name: catForm.name, department: catForm.department };
    try {
      if (catForm.slug) {
        await updateCat({ slug: catForm.slug, body }).unwrap();
        toast.success('Category updated');
      } else {
        await createCat(body).unwrap();
        toast.success('Category created');
      }
      setCatForm({ slug: null, name: '', department: '' });
    } catch {
      toast.error('Failed to save category');
    }
  };
  const handleCatEdit = (c) =>
    setCatForm({ slug: c.slug, name: c.name, department: c.department });
  const handleCatDelete = async (slug) => {
    try {
      await deleteCat(slug).unwrap();
      toast.success('Category deleted');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleSubChange = (e) => {
    setSubForm({ ...subForm, [e.target.name]: e.target.value });
  };
  const handleSubSubmit = async (e) => {
    e.preventDefault();
    const body = { name: subForm.name, category: subForm.category };
    try {
      if (subForm.slug) {
        await updateSub({ slug: subForm.slug, body }).unwrap();
        toast.success('SubCategory updated');
      } else {
        await createSub(body).unwrap();
        toast.success('SubCategory created');
      }
      setSubForm({ slug: null, name: '', category: '' });
    } catch {
      toast.error('Failed to save subcategory');
    }
  };
  const handleSubEdit = (s) =>
    setSubForm({ slug: s.slug, name: s.name, category: s.category });
  const handleSubDelete = async (slug) => {
    try {
      await deleteSub(slug).unwrap();
      toast.success('SubCategory deleted');
    } catch {
      toast.error('Failed to delete subcategory');
    }
  };

  if (deptLoading || catLoading || subLoading)
    return <div className="p-4">Loading...</div>;
  if (deptError || catError || subError)
    return <div className="p-4">Failed to load taxonomy</div>;

  const departments = deptData?.content || [];
  const categories = catData?.content || [];
  const subcategories = subData?.content || [];

  return (
    <div className="p-4 space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-2">Departments</h2>
        <ul className="space-y-2 mb-4">
          {departments.map((d) => (
            <li key={d.id} className="flex justify-between border p-2 rounded">
              <span>{d.name}</span>
              <div className="space-x-2">
                <button
                  className="text-blue-600"
                  onClick={() => handleDeptEdit(d)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDeptDelete(d.slug)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={handleDeptSubmit} className="space-y-2 max-w-sm">
          <input
            type="text"
            name="name"
            value={deptForm.name}
            onChange={handleDeptChange}
            placeholder="Name"
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded"
          >
            {deptForm.slug ? 'Update' : 'Create'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Categories</h2>
        <ul className="space-y-2 mb-4">
          {categories.map((c) => (
            <li key={c.id} className="flex justify-between border p-2 rounded">
              <span>{c.name}</span>
              <div className="space-x-2">
                <button
                  className="text-blue-600"
                  onClick={() => handleCatEdit(c)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleCatDelete(c.slug)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={handleCatSubmit} className="space-y-2 max-w-sm">
          <input
            type="text"
            name="name"
            value={catForm.name}
            onChange={handleCatChange}
            placeholder="Name"
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="department"
            value={catForm.department}
            onChange={handleCatChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded"
          >
            {catForm.slug ? 'Update' : 'Create'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">SubCategories</h2>
        <ul className="space-y-2 mb-4">
          {subcategories.map((s) => (
            <li key={s.id} className="flex justify-between border p-2 rounded">
              <span>{s.name}</span>
              <div className="space-x-2">
                <button
                  className="text-blue-600"
                  onClick={() => handleSubEdit(s)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleSubDelete(s.slug)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubSubmit} className="space-y-2 max-w-sm">
          <input
            type="text"
            name="name"
            value={subForm.name}
            onChange={handleSubChange}
            placeholder="Name"
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="category"
            value={subForm.category}
            onChange={handleSubChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded"
          >
            {subForm.slug ? 'Update' : 'Create'}
          </button>
        </form>
      </section>
    </div>
  );
}
