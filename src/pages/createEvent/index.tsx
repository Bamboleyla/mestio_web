import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { apiService, EventRequest, EventCategory, Location } from '../../services/api';
import styles from './styles.module.scss';

const CreateEventPage: React.FC = () => {
  const [formData, setFormData] = useState<Omit<EventRequest, 'start_date' | 'finish_date' | 'price'>>({
    title: '',
    location_id: 0,
    category_id: 0,
    description: '',
  });

  // Define schedule item type
  type ScheduleItem = {
    date: Date | null;
    times: { time: string; price: number }[];
  };

  // Initialize with one schedule item
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { date: null, times: [{ time: '', price: 0 }] }
  ]);
 const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await apiService.getCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      }
    };

    const fetchLocations = async () => {
      try {
        const fetchedLocations = await apiService.getLocations();
        setLocations(fetchedLocations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load locations');
      }
    };

    fetchCategories();
    fetchLocations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // For now, just validate that we have schedule data
      const hasValidSchedule = schedule.some(item => item.date && item.times.length > 0 && item.times.some(t => t.time));
      if (!hasValidSchedule) {
        setError('Please enter at least one date and time for the event');
        setLoading(false);
        return;
      }

      // In the future, we'll transform schedule data to match the API requirements
      // For now, we'll use a placeholder start_date and finish_date
      const eventData = {
        ...formData,
        start_date: schedule[0].date ? `${schedule[0].date.toISOString().split('T')[0]}T${schedule[0].times[0]?.time || '00:00'}:00` : '',
        finish_date: schedule[0].date ? `${schedule[0].date.toISOString().split('T')[0]}T${schedule[0].times[0]?.time || '23:59'}:00` : '',
        price: schedule[0].times[0]?.price || 0,
      };

      const eventId = await apiService.createEvent(eventData);
      setSuccess(`Event created successfully with ID: ${eventId}`);
      // Reset form
      setFormData({
        title: '',
        location_id: 0,
        category_id: 0,
        description: '',
      });
      setSchedule([{ date: null, times: [{ time: '', price: 0 }] }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <h1>Create New Event</h1>
        </header>
        <main>
          <form onSubmit={handleSubmit} className={styles.container}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location_id" className={styles.label}>Location:</label>
              <select
                id="location_id"
                name="location_id"
                value={formData.location_id}
                onChange={handleNumberChange}
                required
                className={styles.select}
              >
                <option value={0}>Select a location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>           

            <div className={styles.formGroup}>
              <label htmlFor="category_id" className={styles.label}>Category:</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleNumberChange}
                required
                className={styles.select}
              >
                <option value={0}>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={styles.textarea}
              />
            </div>

            {/* Schedule Section */}
            <div className={styles.formGroup}>
                          <label className={styles.label}>Schedule:</label>
                          {schedule.map((item, itemIndex) => (
                            <div key={itemIndex} className={styles.scheduleItem} style={{ position: 'relative' }}>
                              {itemIndex > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSchedule = [...schedule];
                                    newSchedule.splice(itemIndex, 1);
                                    setSchedule(newSchedule);
                                  }}
                                  className={styles.removeButton}
                                  style={{ position: 'absolute', top: -22, right: 5 }}
                                  title="Remove this date"
                                >
                                  ×
                                </button>
                              )}
                              <div className={styles.flexRow}>
                                <div className={styles.datePickerWrapper}>
                                  <label className={styles.label}>Date:</label>
                                  <DatePicker
                                   selected={item.date}
                                   onChange={(date) => {
                                     const newSchedule = [...schedule];
                                     newSchedule[itemIndex].date = date;
                                     setSchedule(newSchedule);
                                   }}
                                   dateFormat="yyyy-MM-dd"
                                   required
                                   className={styles.datePicker}
                                 />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSchedule = [...schedule];
                                      // Copy values from previous item if not the first item
                                      const prevItem = itemIndex > 0 ? schedule[itemIndex - 1] : { date: null, times: [{ time: '', price: 0 }] };
                                      newSchedule.splice(itemIndex + 1, 0, {
                                        date: prevItem.date, // Copy date from previous item
                                        times: [...prevItem.times] // Copy all time/price pairs from previous item
                                      });
                                      setSchedule(newSchedule);
                                    }}
                                    className={styles.addButton}
                                    title="Add new date row"
                                  >
                                    +
                                  </button>
                                </div>
                                
                                <div className={styles.timesContainer}>
                                  <div className={styles.timesList}>
                                    {item.times.map((timePrice, timeIndex) => (
                                      <div key={timeIndex} className={styles.flexRow}>
                                        <div className={styles.flexCol}>
                                          <label className={styles.label}>Time:</label>
                                          <input
                                            type="time"
                                            value={timePrice.time}
                                            onChange={(e) => {
                                              const newSchedule = [...schedule];
                                              newSchedule[itemIndex].times[timeIndex].time = e.target.value;
                                              setSchedule(newSchedule);
                                            }}
                                            className={styles.timeInput}
                                          />
                                        </div>
                                        <div className={styles.flexCol}>
                                          <label className={styles.label}>Price:</label>
                                          <input
                                            type="number"
                                            value={timePrice.price || ''}
                                            onChange={(e) => {
                                              const newSchedule = [...schedule];
                                              newSchedule[itemIndex].times[timeIndex].price = parseFloat(e.target.value) || 0;
                                              setSchedule(newSchedule);
                                            }}
                                            step="0.01"
                                            className={styles.priceInput}
                                          />
                                        </div>
                                        {item.times.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newSchedule = [...schedule];
                                              if (newSchedule[itemIndex].times.length > 1) {
                                                newSchedule[itemIndex].times.splice(timeIndex, 1);
                                                setSchedule(newSchedule);
                                              }
                                            }}
                                            className={styles.removeButton}
                                          >
                                            ×
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSchedule = [...schedule];
                                      newSchedule[itemIndex].times.push({ time: '', price: 0 });
                                      setSchedule(newSchedule);
                                    }}
                                    className={styles.addTimeButton}
                                  >
                                    Add Time/Price
                                  </button>
                                </div>                    
                              </div>
                            </div>
                          ))}
                        </div>            

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </form>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
        </main>
      </div>
    </div>
  );
};

export default CreateEventPage;