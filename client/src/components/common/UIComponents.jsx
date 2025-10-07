import React from "react";
import { 
  FiCalendar, FiUsers, FiSettings, FiBell, FiTrendingUp, FiActivity,
  FiCheckCircle, FiClock, FiStar, FiDownload, FiShare2
} from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

const ButtonDemo = () => (
  <section className="space-y-6">
    <h3 className="text-xl font-semibold text-secondary-900">Button Components</h3>
    <div className="flex flex-wrap gap-4">
      <button className="btn-primary">Primary</button>
      <button className="btn-secondary">Secondary</button>
      <button className="btn-accent">Accent</button>
      <button className="btn-danger">Danger</button>
      <button className="btn-ghost">Ghost</button>
    </div>
  </section>
);

const CardDemo = () => (
  <section className="space-y-6">
    <h3 className="text-xl font-semibold text-secondary-900">Card Components</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary-100 rounded-xl">
            <FiCalendar className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h4 className="font-semibold text-secondary-900">Event Management</h4>
            <p className="text-sm text-secondary-500">Manage your events</p>
          </div>
        </div>
        <p className="text-secondary-600 text-sm">
          Create, edit, and manage all your events in one place with our intuitive interface.
        </p>
      </div>

      <div className="card-hover p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-accent-100 rounded-xl">
            <FiUsers className="w-6 h-6 text-accent-600" />
          </div>
          <div>
            <h4 className="font-semibold text-secondary-900">Member Portal</h4>
            <p className="text-sm text-secondary-500">Connect with members</p>
          </div>
        </div>
        <p className="text-secondary-600 text-sm">
          Stay connected with your community and manage member relationships effectively.
        </p>
      </div>

      <div className="card p-6 bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-warning-100 rounded-xl">
            <FiSettings className="w-6 h-6 text-warning-600" />
          </div>
          <div>
            <h4 className="font-semibold text-secondary-900">Admin Tools</h4>
            <p className="text-sm text-secondary-500">Powerful administration</p>
          </div>
        </div>
        <p className="text-secondary-600 text-sm">
          Access powerful admin tools to manage your entire event management system.
        </p>
      </div>
    </div>
  </section>
);

const StatsDemo = () => {
  const stats = [
    { label: "Total Events", value: "24", icon: FiCalendar, change: "+12%", color: "primary" },
    { label: "Active Members", value: "1,234", icon: FiUsers, change: "+8%", color: "accent" },
    { label: "This Month", value: "156", icon: FiActivity, change: "+23%", color: "warning" },
    { label: "Growth Rate", value: "18.2%", icon: FiTrendingUp, change: "+5%", color: "success" },
  ];

  return (
    <section className="space-y-6">
      <h3 className="text-xl font-semibold text-secondary-900">Statistics Cards</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card p-6 hover:shadow-medium transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-medium text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded-lg`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 mb-1">{stat.value}</p>
                <p className="text-sm text-secondary-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const FormDemo = () => (
  <section className="space-y-6">
    <h3 className="text-xl font-semibold text-secondary-900">Form Components</h3>
    <div className="card p-6 max-w-md">
      <form className="space-y-4">
        <div>
          <label className="form-label">Email</label>
          <input type="email" placeholder="Enter email" className="form-input"/>
        </div>
        <div>
          <label className="form-label">Password</label>
          <input type="password" placeholder="Enter password" className="form-input"/>
        </div>
        <div>
          <label className="form-label">Select</label>
          <select className="form-input">
            <option>Choose...</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
        <div>
          <label className="form-label">Message</label>
          <textarea placeholder="Enter message" rows={3} className="form-input"></textarea>
        </div>
        <button type="submit" className="btn-primary w-full">Submit</button>
      </form>
    </div>
  </section>
);

const NavigationDemo = () => (
  <section className="space-y-6">
    <h3 className="text-xl font-semibold text-secondary-900">Navigation Components</h3>
    <div className="card p-6 space-y-2">
      <a href="#" className="nav-link flex items-center gap-2"><FiCalendar/> Dashboard</a>
      <a href="#" className="nav-link-active flex items-center gap-2"><FiUsers/> Members</a>
      <a href="#" className="nav-link flex items-center gap-2"><FiSettings/> Settings</a>
      <a href="#" className="nav-link flex items-center gap-2"><FiBell/> Notifications</a>
    </div>
  </section>
);

const AlertDemo = () => (
  <section className="space-y-6">
    <h3 className="text-xl font-semibold text-secondary-900">Alert Components</h3>
    <div className="space-y-4">
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-center gap-3">
        <FiCheckCircle className="w-5 h-5 text-primary-600"/>
        <span className="text-primary-700 font-medium">Success! Your action was completed.</span>
      </div>
      <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 flex items-center gap-3">
        <FiClock className="w-5 h-5 text-warning-600"/>
        <span className="text-warning-700 font-medium">Warning! Please check your input.</span>
      </div>
      <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 flex items-center gap-3">
        <FiActivity className="w-5 h-5 text-danger-600"/>
        <span className="text-danger-700 font-medium">Error! Something went wrong.</span>
      </div>
    </div>
  </section>
);

const UIComponents = () => (
  <div className="p-8 space-y-12">
    <div className="text-center relative mb-12">
      <div className="absolute top-0 right-0"><ThemeToggle variant="dropdown" /></div>
      <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">NEXPANDO Design System</h1>
      <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
        Modern UI components with dark mode support for the Event Management system.
      </p>
    </div>

    <ButtonDemo />
    <CardDemo />
    <StatsDemo />
    <FormDemo />
    <NavigationDemo />
    <AlertDemo />

    <div className="text-center py-12">
      <div className="card p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 mx-auto shadow-glow">
          <FiStar className="w-8 h-8 text-white"/>
        </div>
        <h3 className="text-2xl font-bold text-secondary-900 mb-4">Ready to Get Started?</h3>
        <p className="text-secondary-600 mb-6">
          This design system provides all the components you need for a professional application.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary flex items-center gap-2"><FiDownload/> Download</button>
          <button className="btn-secondary flex items-center gap-2"><FiShare2/> Share</button>
        </div>
      </div>
    </div>
  </div>
);

export default UIComponents;
