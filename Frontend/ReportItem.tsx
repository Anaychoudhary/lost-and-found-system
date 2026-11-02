import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, type ItemCategory } from './src/services/api';

export const ReportItem: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reportType, setReportType] = useState<'LOST' | 'FOUND'>(() =>
    searchParams.get('type')?.toUpperCase() === 'FOUND' ? 'FOUND' : 'LOST',
  );
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'ELECTRONICS' as ItemCategory,
    location: '',
    date: '',
    description: '',
    contactInfo: '',
    storageLocation: '',
    rewardOffered: '',
  });
  const currentDate = new Date();
  const maxDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: name === 'category' ? value as ItemCategory : value,
    }));
    setSubmitted(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    setError(null);

    const common = {
      title: formData.itemName.trim(),
      category: formData.category,
      description: formData.description.trim(),
      location: formData.location,
    };

    try {
      if (reportType === 'LOST') {
        await api.createLostItem({
          ...common,
          dateLost: formData.date,
          reporterContact: formData.contactInfo.trim(),
          ...(formData.rewardOffered ? { rewardOffered: Number(formData.rewardOffered) } : {}),
        });
      } else {
        await api.createFoundItem({
          ...common,
          dateFound: formData.date,
          finderContact: formData.contactInfo.trim(),
          storageLocation: formData.storageLocation.trim(),
        });
      }
      setSubmitted(true);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'Unable to save the report.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectReportType = (type: 'LOST' | 'FOUND') => {
    setReportType(type);
    setSearchParams({ type: type.toLowerCase() });
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="container report-container py-4 py-lg-5">
      <div className="text-center mb-4">
        <p className="page-eyebrow mb-2">Help bring it home</p>
        <h1 className="h2 mb-2">Submit an item report</h1>
        <p className="text-body-secondary mb-0">Share a few details so our campus community can help.</p>
      </div>

      <section className="custom-card p-3 p-md-4 p-lg-5">
        <div className="report-toggle mb-4" role="group" aria-label="Choose lost or found report">
          <button
            type="button"
            aria-pressed={reportType === 'LOST'}
            className={`btn ${reportType === 'LOST' ? 'active-lost' : ''}`}
            onClick={() => selectReportType('LOST')}
          >
            I Lost Something
          </button>
          <button
            type="button"
            aria-pressed={reportType === 'FOUND'}
            className={`btn ${reportType === 'FOUND' ? 'active-found' : ''}`}
            onClick={() => selectReportType('FOUND')}
          >
            I Found Something
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {submitted && (
            <div className="alert alert-success" role="status">
              Your {reportType.toLowerCase()} report was saved successfully.
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="itemName" className="form-label">Item title or name</label>
            <input
              id="itemName"
              type="text"
              name="itemName"
              className="form-control"
              placeholder="e.g., Blue Fastrack Backpack, Airpods Pro Case"
              required
              value={formData.itemName}
              onChange={handleChange}
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="category" className="form-label">Category</label>
              <select id="category" name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="ELECTRONICS">Electronics</option>
                <option value="DOCUMENTS">ID Cards & Documents</option>
                <option value="BAGS">Bags & Wallets</option>
                <option value="KEYS">Keys</option>
                <option value="CLOTHING">Clothing & Accessories</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="location" className="form-label">Campus location</label>
              <select id="location" name="location" className="form-select" value={formData.location} onChange={handleChange} required>
                <option value="">Select a location</option>
                <option value="Central Library">Central Library</option>
                <option value="Main Canteen">Main Canteen</option>
                <option value="Tech Block A">Tech Block A</option>
                <option value="Sports Complex">Sports Complex</option>
                <option value="Auditorium">Auditorium</option>
              </select>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="date" className="form-label">{reportType === 'LOST' ? 'Date lost' : 'Date found'}</label>
              <input id="date" type="date" name="date" className="form-control" max={maxDate} required value={formData.date} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="contactInfo" className="form-label">Contact information</label>
              <input
                id="contactInfo"
                type="text"
                name="contactInfo"
                className="form-control"
                placeholder="e.g., student@college.edu or 9876543210"
                required
                value={formData.contactInfo}
                onChange={handleChange}
              />
            </div>
          </div>

          {reportType === 'FOUND' ? (
            <div className="mb-3">
              <label htmlFor="storageLocation" className="form-label">Where is the item being stored?</label>
              <input
                id="storageLocation"
                type="text"
                name="storageLocation"
                className="form-control"
                required
                value={formData.storageLocation}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="mb-3">
              <label htmlFor="rewardOffered" className="form-label">Reward offered (optional)</label>
              <input
                id="rewardOffered"
                type="number"
                name="rewardOffered"
                className="form-control"
                min="0"
                step="0.01"
                value={formData.rewardOffered}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="description" className="form-label">Description &amp; identifiers</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={3}
              placeholder="Include unique marks, colors, scratch details, or keychains..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" disabled={submitting} className={`btn w-100 btn-lg ${reportType === 'LOST' ? 'btn-navy' : 'btn-gold'}`}>
            {submitting ? 'Saving…' : `Submit ${reportType === 'LOST' ? 'Lost' : 'Found'} Report`}
          </button>
        </form>
      </section>
    </div>
  );
};