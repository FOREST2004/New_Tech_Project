import React from "react";

const EditEventForm = ({ event = {}, onChange, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="form-label">
          Event name
        </label>
        <input
          type="text"
          name="title"
          value={event.title || ""}
          onChange={onChange}
          placeholder="Enter event name"
          className="form-input"
          required
        />
      </div>

     
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={event.location || ""}
          onChange={onChange}
          placeholder="Enter event location"
          className="form-input"
        />
      </div>

      
    
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event start time
          </label>
          <input
            type="datetime-local"
            name="startAt"
            value={event.startAt || ""}
            onChange={onChange}
            step="1"
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event end time
          </label>
          <input
            type="datetime-local"
            name="endAt"
            value={event.endAt || ""}
            onChange={onChange}
            step="1"
            className="form-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration start
          </label>
          <input
            type="datetime-local"
            name="registrationStartAt"
            value={event.registrationStartAt || ""}
            onChange={onChange}
            step="1"
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration end
          </label>
          <input
            type="datetime-local"
            name="registrationEndAt"
            value={event.registrationEndAt || ""}
            onChange={onChange}
            step="1"
            className="form-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min attendees
          </label>
          <input
            type="number"
            name="minAttendees"
            value={event.minAttendees || ""}
            onChange={onChange}
            placeholder="0"
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max attendees
          </label>
          <input
            type="number"
            name="maxAttendees"
            value={event.maxAttendees || ""}
            onChange={onChange}
            placeholder="100"
            className="form-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of registered users
        </label>
        <input
          type="number"
          value={event.registeredCount || 0}
          readOnly
          className="form-input"
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deposit (VND)
        </label>
        <input
          type="number"
          name="deposit"
          value={event.deposit || ""}
          onChange={onChange}
          placeholder="0"
          className="form-input"
          step="0.01"
          min="0"
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={event.description || ""}
          onChange={onChange}
          rows="3"
          placeholder="Enter event description"
          className="form-input"
        />
      </div>


   
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 py-2 rounded font-semibold transition 
          bg-blue-500 text-white hover:bg-blue-600
          dark:bg-blue-800 dark:bg-text-white dark:hover:bg-blue-900
          "
        >
          Update Event
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 text-white py-2 font-semibold transition rounded 
          bg-red-500 hover:bg-red-600 
          dark:bg-red-800 dark:hover:bg-red-900
          "
        >
          Cancel Event
        </button>
      </div>
    </form>
  );
};

export default EditEventForm;
