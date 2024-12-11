'use client';

import { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Table, Message, Header } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useRouter } from 'next/navigation';
import { Search, SearchProps } from 'semantic-ui-react';

interface Employee {
  _id: string;
  id: string;
  name: string;
  building: string;
  provider: string;
}

interface BadgeRecord {
  _id: string;
  employeeName: string;
  employeeId: string;
  badgeNumber: string;
  issuedAt: string;
  returnedAt: string | null;
  status: 'issued' | 'returned';
  building: string;
  provider: string;
}

interface SearchResult {
  title: string;
  description: string;
  id: string;
  building: string;
  provider: string;
}

interface DateFilter {
  startDate: string;
  endDate: string;
}

const formatInPST = (dateString: string | null): string => {
  if (!dateString) return '-';
  
  // Create a UTC date from the ISO string
  const utcDate = new Date(dateString);
  
  // Format in PST
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short'
  };

  return utcDate.toLocaleString('en-US', options);
};

const formatDateForInput = (date: string): string => {
  return date;
};

export default function BadgeManagement() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [badgeRecords, setBadgeRecords] = useState<BadgeRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BadgeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [tableSearchValue, setTableSearchValue] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: '',
    endDate: ''
  });
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    badgeNumber: '',
    building: localStorage.getItem('selectedBuilding') || '',
    provider: ''
  });
  const searchTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const selectedBuilding = localStorage.getItem('selectedBuilding');
    if (!selectedBuilding) {
      router.push('/building-select');
      return;
    }
    setFormData(prev => ({ ...prev, building: selectedBuilding }));
    fetchEmployees();
    fetchBadgeRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [badgeRecords, dateFilter, tableSearchValue]);

  const filterRecords = () => {
    let filtered = [...badgeRecords];

    // Apply date filters
    if (dateFilter.startDate) {
      const startDate = new Date(dateFilter.startDate);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.issuedAt);
        return recordDate >= startDate;
      });
    }

    if (dateFilter.endDate) {
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.issuedAt);
        return recordDate <= endDate;
      });
    }

    // Apply search filter
    if (tableSearchValue.trim()) {
      const searchLower = tableSearchValue.toLowerCase();
      filtered = filtered.filter(record => 
        record.employeeName.toLowerCase().includes(searchLower) ||
        record.badgeNumber.toLowerCase().includes(searchLower) ||
        record.status.toLowerCase().includes(searchLower) ||
        record.building.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRecords(filtered);
  };

  const handleDateChange = (date: Date | null, field: 'startDate' | 'endDate') => {
    if (date) {
      const formattedDate = formatInPST(date.toISOString());
      setDateFilter(prev => ({
        ...prev,
        [field]: formattedDate
      }));
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF() as jsPDF & { getNumberOfPages: () => number };
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Los_Angeles'
    });

    // Add title and date
    doc.setFontSize(16);
    doc.text('Badge Management Report', 14, 15);
    doc.setFontSize(11);
    doc.text(`Generated on: ${currentDate}`, 14, 22);
    
    // Add filter information if any
    let yPos = 29;
    if (dateFilter.startDate || dateFilter.endDate || tableSearchValue) {
      doc.setFontSize(10);
      if (dateFilter.startDate) {
        doc.text(`Start Date: ${dateFilter.startDate}`, 14, yPos);
        yPos += 7;
      }
      if (dateFilter.endDate) {
        doc.text(`End Date: ${dateFilter.endDate}`, 14, yPos);
        yPos += 7;
      }
      if (tableSearchValue) {
        doc.text(`Search Term: ${tableSearchValue}`, 14, yPos);
        yPos += 7;
      }
    }

    // Prepare table data
    const tableData = filteredRecords.map(record => [
      record.employeeId,
      record.employeeName,
      record.badgeNumber,
      record.building,
      record.provider,
      formatInPST(record.issuedAt),
      record.status,
      formatInPST(record.returnedAt) || '-'
    ]);

    // Add table
    autoTable(doc, {
      startY: yPos,
      head: [[
        'ID',
        'Employee',
        'Badge Number',
        'Building',
        'Provider',
        'Issued At',
        'Status',
        'Returned At'
      ]],
      body: tableData,
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: 255,
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 25 }, // ID
        1: { cellWidth: 30 }, // Employee
        2: { cellWidth: 25 }, // Badge Number
        3: { cellWidth: 20 }, // Building
        4: { cellWidth: 20 }, // Provider
        5: { cellWidth: 35 }, // Issued At
        6: { cellWidth: 15 }, // Status
        7: { cellWidth: 35 }  // Returned At
      },
      margin: { left: 14, right: 14 },
      didDrawPage: function(data) {
        // Add page number at the bottom
        const pageCount = (doc as any).getNumberOfPages();
        const currentPage = (doc as any).getCurrentPageInfo().pageNumber;
        doc.setFontSize(8);
        doc.text(
          `Page ${currentPage} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
    });

    // Save the PDF
    doc.save('badge-management-report.pdf');
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/employees?q=${searchValue}`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
      
      const results = data.map((employee: any) => ({
        id: employee.id,
        title: employee.name,
        description: `ID: ${employee.id} - Building: ${employee.building} - Provider: ${employee.provider}`,
        building: employee.building,
        provider: employee.provider
      }));
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBadgeRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/badges');
      if (!response.ok) throw new Error('Failed to fetch badge records');
      const data = await response.json();
      setBadgeRecords(data);
    } catch (error) {
      console.error('Error fetching badge records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (
    event: React.MouseEvent<HTMLElement>,
    data: SearchProps
  ) => {
    setLoading(true);
    const searchQuery = data.value || '';
    setSearchValue(searchQuery);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // If empty search, clear results
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    // Set new timeout
    searchTimeout.current = setTimeout(() => {
      fetch(`/api/employees?q=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
          const results = data.map((employee: any) => ({
            id: employee.id,
            title: employee.name,
            description: `ID: ${employee.id} - Building: ${employee.building} - Provider: ${employee.provider}`,
            building: employee.building,
            provider: employee.provider
          }));
          setSearchResults(results);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);
  };

  const handleSearchSelect = (
    event: React.MouseEvent<HTMLElement>,
    data: SearchProps
  ) => {
    const result = data.result as SearchResult;
    setFormData({
      ...formData,
      employeeName: result.title,
      employeeId: result.id,
      provider: result.provider
    });
    setSearchValue('');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate employee selection
    const selectedEmployee = employees.find(emp => emp.name === formData.employeeName);
    if (!selectedEmployee) {
      setError('Please select a valid employee from the search results');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/badges', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeName: formData.employeeName,
          employeeId: formData.employeeId,
          badgeNumber: formData.badgeNumber,
          building: formData.building,
          provider: formData.provider
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create badge record');
      }

      // Clear form and show success message
      setFormData(prev => ({
        ...prev,
        employeeName: '',
        employeeId: '',
        badgeNumber: '',
        provider: ''
      }));
      setSuccess('Badge record created successfully');
      
      // Fetch updated badge records
      await fetchBadgeRecords();
      
    } catch (error) {
      console.error('Error creating badge record:', error);
      setError(error instanceof Error ? error.message : 'Failed to create badge record');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/badges', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          status: 'returned',
          returnedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to return badge');
      }

      // Fetch updated badge records
      await fetchBadgeRecords();
      setSuccess('Badge returned successfully');
    } catch (error) {
      console.error('Error returning badge:', error);
      setError('Failed to return badge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} error={!!error} success={!!success}>
        <Message error content={error} />
        <Message success content={success} />
        
        <Form.Group>
          <Form.Field width={6}>
            <label>Employee Name</label>
            <Search
              loading={loading}
              onResultSelect={handleSearchSelect}
              onSearchChange={handleSearchChange}
              results={searchResults}
              value={searchValue}
              placeholder="Search employees..."
              noResultsMessage="No employees found"
            />
          </Form.Field>
        </Form.Group>

        <Form.Field>
          <label>Employee ID</label>
          <Input
            value={formData.employeeId}
            readOnly
            placeholder="ID will be auto-filled"
          />
        </Form.Field>

        <Form.Field>
          <label>Badge Number</label>
          <Input
            value={formData.badgeNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, badgeNumber: e.target.value }))}
            placeholder="Enter badge number"
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Provider</label>
          <Input
            value={formData.provider}
            onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
            placeholder="Enter provider"
          />
        </Form.Field>

        <Button primary type="submit" loading={loading}>
          Issue Badge
        </Button>
      </Form>

      <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <Header as='h2'>
          Badge Management - {formData.building}
          <Button 
            floated='right'
            onClick={() => router.push('/building-select')}
            style={{ marginLeft: '1rem' }}
          >
            Change Building
          </Button>
        </Header>
        <Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Start Date</label>
              <DatePicker
                selected={dateFilter.startDate ? new Date(dateFilter.startDate) : null}
                onChange={(date) => handleDateChange(date, 'startDate')}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select start date"
                className="form-control"
              />
            </Form.Field>
            <Form.Field>
              <label>End Date</label>
              <DatePicker
                selected={dateFilter.endDate ? new Date(dateFilter.endDate) : null}
                onChange={(date) => handleDateChange(date, 'endDate')}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select end date"
                className="form-control"
              />
            </Form.Field>
            <Form.Field>
              <label>Search Records</label>
              <Input
                icon='search'
                placeholder='Search by name, badge number, or status...'
                value={tableSearchValue}
                onChange={(e) => setTableSearchValue(e.target.value)}
              />
            </Form.Field>
          </Form.Group>
        </Form>
        <Button 
          color='blue'
          onClick={exportToPDF}
          style={{ marginTop: '1rem' }}
          disabled={filteredRecords.length === 0}
        >
          Export to PDF
        </Button>
      </div>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Employee</Table.HeaderCell>
            <Table.HeaderCell>Badge Number</Table.HeaderCell>
            <Table.HeaderCell>Building</Table.HeaderCell>
            <Table.HeaderCell>Provider</Table.HeaderCell>
            <Table.HeaderCell>Issued At</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Returned At</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredRecords.map((record) => (
            <Table.Row key={record._id}>
              <Table.Cell>{record.employeeId}</Table.Cell>
              <Table.Cell>{record.employeeName}</Table.Cell>
              <Table.Cell>{record.badgeNumber}</Table.Cell>
              <Table.Cell>{record.building}</Table.Cell>
              <Table.Cell>{record.provider}</Table.Cell>
              <Table.Cell>{formatInPST(record.issuedAt)}</Table.Cell>
              <Table.Cell>{record.status}</Table.Cell>
              <Table.Cell>{formatInPST(record.returnedAt)}</Table.Cell>
              <Table.Cell>
                {record.status === 'issued' && (
                  <Button
                    color="green"
                    size="small"
                    onClick={() => handleReturn(record._id)}
                    loading={loading}
                  >
                    Return Badge
                  </Button>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
