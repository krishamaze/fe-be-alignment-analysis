# State Reference

## API endpoints

| Key                           | Method & Path                               | Cache tags | Used in                                                                         |
| ----------------------------- | ------------------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| `createStore`                 | `POST /api/stores`                          | n/a        | `pages/Store.jsx`                                                               |
| `updateStore`                 | `PUT /api/stores/:id`                       | n/a        | `pages/Store.jsx`                                                               |
| `getStores`                   | `GET /api/stores`                           | n/a        | `pages/Store.jsx`, `pages/User.jsx`                                             |
| `modifyStoreStatus`           | `PATCH /api/stores/:id`                     | n/a        | `pages/Store.jsx`                                                               |
| `softDeleteStore`             | `DELETE /api/stores/:id`                    | n/a        | `pages/Store.jsx`                                                               |
| `assignBranchHeadToStore`     | `POST /api/stores/:id/assign-branch-head`   | n/a        | `components/Store/BranchHeadModal.jsx`, `components/Store/StoreAssignModal.jsx` |
| `unassignBranchHeadFromStore` | `POST /api/stores/:id/unassign-branch-head` | n/a        | `components/Store/BranchHeadModal.jsx`, `components/Store/StoreAssignModal.jsx` |
| `getUsers`                    | `GET /api/users`                            | n/a        | `pages/User.jsx`, `components/Store/BranchHeadModal.jsx`                        |
| `createUser`                  | `POST /api/users`                           | n/a        | `pages/User.jsx`                                                                |
| `updateUser`                  | `PUT /api/users/:id`                        | n/a        | `pages/User.jsx`                                                                |
| `modifyUserStatus`            | `PATCH /api/users/:id`                      | n/a        | `pages/User.jsx`                                                                |
| `softDeleteUser`              | `DELETE /api/users/:id`                     | n/a        | `pages/User.jsx`                                                                |
| `assignStoreToUser`           | `PATCH /api/users/:id`                      | n/a        | `components/Store/StoreAssignModal.jsx`                                         |
| `unassignStoreFromUser`       | `PATCH /api/users/:id`                      | n/a        | `components/Store/StoreAssignModal.jsx`                                         |

## Slices

| Slice   | Purpose                              | Persisted?               | Selectors                                                                    |
| ------- | ------------------------------------ | ------------------------ | ---------------------------------------------------------------------------- |
| `auth`  | auth tokens and user metadata        | tokens stored in cookies | direct state access (`state.auth`)                                           |
| `user`  | list of users with pagination info   | no                       | `state.user.userData`, `state.user.totalPages`, `state.user.pageSize`, etc.  |
| `store` | store catalogue with pagination      | no                       | `state.store.stores`, `state.store.totalPages`, `state.store.pageSize`, etc. |
| `cart`  | cart items and totals for e‑commerce | no                       | `state.cart.items`, `state.cart.total`                                       |

## Invalidation

There is no automatic cache invalidation. After mutations (create/update/delete), components explicitly re‑dispatch query thunks, e.g. `dispatch(getStores())` after `createStore`.

