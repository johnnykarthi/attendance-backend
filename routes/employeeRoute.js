const express = require('express');
const router = express.Router();

const {createEmployee,getEmployee,updateEmployee,deleteEmployee,saveWorkDates,generateReport} = require('../controllers/EmployeeController')

const {requireAuth} = require('../middleware/requireAuth')


//MiddleWare
router.use(requireAuth)

router.get('/',getEmployee)

router.post('/',createEmployee)

router.patch('/:id',updateEmployee)

router.post('/saveWorkDates',saveWorkDates)

router.delete('/:id',deleteEmployee)

router.post('/report',generateReport)


module.exports = router;