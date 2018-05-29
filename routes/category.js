const CategoryController = require('../api/controllers/category-controller');

module.exports = [
  {
    method: 'POST',
    path: '/categories',
    options: { handler: CategoryController.create }
  },
  {
    method: 'GET',
    path: '/categories',
    options: { handler: CategoryController.retrieve }
  },
  {
    method: 'DELETE',
    path: '/categories/{id}',
    options: { handler: CategoryController.delete }
  }
];
