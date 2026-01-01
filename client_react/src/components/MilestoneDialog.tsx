import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  IconButton,
  Paper,
  Typography,
  InputAdornment
} from '@mui/material';
import { Add, Delete, Flag, Folder, OpenInNew } from '@mui/icons-material';

interface Supplier {
  supplierId: string;
  supplierName: string;
  amount: number;
  isPaid: boolean;
  date?: string;
}

interface MilestoneDialogProps {
  open: boolean;
  onClose: () => void;
  milestone?: any;
  stageName: string;
  onSave: (data: any) => void;
}

export const MilestoneDialog = ({ open, onClose, milestone, stageName, onSave }: MilestoneDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    documentReference: '',
    date: '',
    statusNumber: 1,
    isUrgent: false,
    suppliers: [] as Supplier[]
  });

  useEffect(() => {
    if (milestone) {
      setFormData({
        name: milestone.name || '',
        documentReference: milestone.documentReference || '',
        date: milestone.date || '',
        statusNumber: milestone.statusNumber || 1,
        isUrgent: milestone.isUrgent || false,
        suppliers: milestone.suppliers || []
      });
    } else {
      setFormData({
        name: '',
        documentReference: '',
        date: '',
        statusNumber: 1,
        isUrgent: false,
        suppliers: []
      });
    }
  }, [milestone, open]);

  const handleAddSupplier = () => {
    setFormData({
      ...formData,
      suppliers: [...formData.suppliers, {
        supplierId: '',
        supplierName: '',
        amount: 0,
        isPaid: false,
        date: ''
      }]
    });
  };

  const handleRemoveSupplier = (index: number) => {
    const newSuppliers = formData.suppliers.filter((_, i) => i !== index);
    setFormData({ ...formData, suppliers: newSuppliers });
  };

  const handleSupplierChange = (index: number, field: string, value: any) => {
    const newSuppliers = [...formData.suppliers];
    newSuppliers[index] = { ...newSuppliers[index], [field]: value };
    setFormData({ ...formData, suppliers: newSuppliers });
  };

  const handleSave = () => {
    onSave({
      ...milestone,
      ...formData
    });
    onClose();
  };

  const openDocumentLink = () => {
    if (formData.documentReference) {
      window.open(formData.documentReference, '_blank');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(19, 16, 33, 0.98)',
          border: '1px solid rgba(168,85,247,0.3)',
          borderRadius: '16px'
        }
      }}
    >
      <DialogTitle sx={{ color: '#ffffff', borderBottom: '1px solid rgba(168,85,247,0.2)' }}>
        {milestone ? `עריכת אבן דרך: ${milestone.name}` : 'הוספת אבן דרך חדשה'}
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Name */}
          <TextField
            label="שם אבן הדרך"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
            InputProps={{
              startAdornment: <Flag sx={{ mr: 1, color: 'rgba(255,255,255,0.5)' }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(45, 32, 74, 0.3)',
                '& fieldset': { borderColor: 'rgba(168,85,247,0.5)' },
                '&:hover fieldset': { borderColor: 'rgba(168,85,247,0.7)' }
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiInputBase-input': { color: '#ffffff' }
            }}
          />

          {/* Document Reference */}
          <Box sx={{ position: 'relative' }}>
            <TextField
              label="קישור למסמך ב-Google Drive"
              value={formData.documentReference}
              onChange={(e) => setFormData({ ...formData, documentReference: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="הדבק קישור ל-Google Drive..."
              InputProps={{
                startAdornment: <Folder sx={{ mr: 1, color: 'rgba(255,255,255,0.5)' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(45, 32, 74, 0.3)',
                  '& fieldset': { borderColor: 'rgba(168,85,247,0.5)' },
                  '&:hover fieldset': { borderColor: 'rgba(168,85,247,0.7)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputBase-input': { color: '#ffffff' }
              }}
            />
            {formData.documentReference && (
              <IconButton
                onClick={openDocumentLink}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: 8,
                  color: '#60a5fa'
                }}
              >
                <OpenInNew />
              </IconButton>
            )}
          </Box>

          {/* Date, Status, Urgent */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="תאריך"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(45, 32, 74, 0.3)',
                  '& fieldset': { borderColor: 'rgba(168,85,247,0.5)' },
                  '&:hover fieldset': { borderColor: 'rgba(168,85,247,0.7)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputBase-input': { color: '#ffffff' }
              }}
            />
            <FormControl 
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(45, 32, 74, 0.3)',
                  '& fieldset': { borderColor: 'rgba(168,85,247,0.5)' },
                  '&:hover fieldset': { borderColor: 'rgba(168,85,247,0.7)' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiSelect-select': { color: '#ffffff' },
                '& .MuiSvgIcon-root': { color: '#ffffff' }
              }}
            >
              <InputLabel>סטטוס</InputLabel>
              <Select
                value={formData.statusNumber}
                label="סטטוס"
                onChange={(e) => setFormData({ ...formData, statusNumber: Number(e.target.value) })}
              >
                <MenuItem value={1}>בוצע</MenuItem>
                <MenuItem value={2}>ממתין</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                />
              }
              label={<Typography sx={{ color: '#ef4444', fontWeight: 600 }}>דחוף</Typography>}
            />
          </Box>

          {/* Suppliers Section */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>ספקים</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddSupplier}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                הוסף ספק
              </Button>
            </Box>

            {formData.suppliers.map((supplier, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: 'rgba(45, 32, 74, 0.5)',
                  border: '1px solid rgba(168,85,247,0.3)'
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    label="שם ספק"
                    value={supplier.supplierName}
                    onChange={(e) => handleSupplierChange(index, 'supplierName', e.target.value)}
                    sx={{ 
                      flex: 2,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(19, 16, 33, 0.3)',
                        '& fieldset': { borderColor: 'rgba(168,85,247,0.5)' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: '#ffffff' }
                    }}
                  />
                  <TextField
                    label="סכום"
                    type="number"
                    value={supplier.amount}
                    onChange={(e) => handleSupplierChange(index, 'amount', Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start" sx={{ color: '#ffffff' }}>₪</InputAdornment>
                    }}
                    sx={{ 
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(19, 16, 33, 0.3)',
                        '& fieldset': { borderColor: 'rgba(168,85,247,0.5)' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: '#ffffff' }
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={supplier.isPaid}
                        onChange={(e) => handleSupplierChange(index, 'isPaid', e.target.checked)}
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                      />
                    }
                    label={<Typography sx={{ color: '#ffffff' }}>שולם</Typography>}
                  />
                  <IconButton
                    onClick={() => handleRemoveSupplier(index)}
                    sx={{ color: '#fca5a5' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(168,85,247,0.2)', p: 2 }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
          ביטול
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  );
};
