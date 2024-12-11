import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  building: {
    type: String,
    enum: ['Caleres1', 'Caleres2'],
    required: true,
  },
  provider: {
    type: String,
    enum: ['Staffmark', 'A1'],
    required: true,
  }
});

// Check if the model exists before creating a new one
const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

export default Employee;
