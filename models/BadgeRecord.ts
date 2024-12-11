import mongoose from 'mongoose';

const BadgeRecordSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  badgeNumber: {
    type: String,
    required: true,
  },
  employeeId: {
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
  },
  issuedAt: {
    type: Date,
    required: true,
  },
  returnedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['issued', 'returned'],
    default: 'issued',
  }
});

export default mongoose.models.BadgeRecord || mongoose.model('BadgeRecord', BadgeRecordSchema);
