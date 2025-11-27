import {Link} from 'react-router';
import type {Route} from './+types/($locale).careers';

export async function loader({context}: Route.LoaderArgs) {
  return {};
}

const jobListings = [
  {
    id: 1,
    title: 'Senior Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Lead the design of innovative golf products that push boundaries.',
  },
  {
    id: 2,
    title: 'E-commerce Manager',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Drive our online sales strategy and optimize customer experience.',
  },
  {
    id: 3,
    title: 'Golf Ball Engineer',
    department: 'Engineering',
    location: 'Germany',
    type: 'Full-time',
    description: 'Develop next-generation golf ball technology and performance.',
  },
  {
    id: 4,
    title: 'Customer Success Specialist',
    department: 'Customer Service',
    location: 'Remote',
    type: 'Full-time',
    description: 'Ensure exceptional customer experiences and build lasting relationships.',
  },
];

const benefits = [
  {
    icon: '🏥',
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance and wellness programs',
  },
  {
    icon: '🏖️',
    title: 'Flexible Time Off',
    description: 'Generous PTO and flexible work arrangements',
  },
  {
    icon: '⛳',
    title: 'Golf Perks',
    description: 'Free VICE products and access to exclusive golf events',
  },
  {
    icon: '📚',
    title: 'Learning & Development',
    description: 'Professional development budget and training opportunities',
  },
  {
    icon: '💰',
    title: 'Competitive Salary',
    description: 'Market-leading compensation and performance bonuses',
  },
  {
    icon: '🌍',
    title: 'Remote Work',
    description: 'Work from anywhere with our remote-first culture',
  },
];

export default function Careers() {
  return (
    <div className="careers-page">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80)',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center px-8 md:px-16 lg:px-24">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              VICE GOLF CAREERS
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Help us shape the future of golf
            </p>
            <Link
              to="#about"
              className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 px-8 md:px-16 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900">
            About Us
          </h2>
          
          {/* Mission Section */}
          <div className="bg-[#e8e6e1] rounded-lg py-12 px-8 md:px-16 mb-12">
            <div className="max-w-4xl mx-auto text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                Our Mission
              </h3>
              
              {/* Description */}
              <p className="text-lg text-gray-700 leading-relaxed">
                Founded in Munich on 12.12.12 by Ingo Düllman and Rainer Stöckl, Vice Golf began as the first DTC golf 
                ball brand, delivering premium Cast Urethane balls at unmatched prices. Building on its success, Vice 
                expanded into meticulously crafted apparel and gear, then launched groundbreaking clubs in 2024, 
                leveraging data from thousands of players to redefine the game.
              </p>
            </div>
          </div>
          
          {/* Button */}
          <div className="flex justify-center mb-16">
            <Link
              to="/about"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Check our story
            </Link>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Offices Card */}
            <div className="bg-black text-white rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-3">2</div>
              <div className="text-lg font-medium">Offices</div>
            </div>
            
            {/* Nationalities Card */}
            <div className="bg-black text-white rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-3">19</div>
              <div className="text-lg font-medium">Nationalities</div>
            </div>
            
            {/* Employees Card */}
            <div className="bg-black text-white rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-3">75+</div>
              <div className="text-lg font-medium">Employees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-[#e8e6e1]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <svg className="w-20 h-20 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
          </div>
          
          {/* Mission Text */}
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Our mission is to offer you the best product at the best price. Our goal and 
            core values are being transparent with our customers and making golf a 
            joyful and accessible sport.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Our Core Values
          </h2>
          
          {/* Subtitle */}
          <p className="text-center text-gray-600 mb-20 max-w-3xl mx-auto text-base">
            Our values are the driving force behind everything we do. Whether in the office or on the course, 
            these principles help us tackle challenges, innovate, and celebrate success as a unified team.
          </p>
          
          {/* Values Cards Container */}
          <div className="relative flex items-center justify-center">
            {/* Left Arrow */}
            <button className="absolute left-0 md:left-8 z-20 w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Values Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-16 md:px-20">
              {/* Empowerment Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm min-h-[400px] flex flex-col">
                <div className="text-gray-400 text-sm font-medium mb-6">06</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Empowerment</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  We trust our team members to make informed decisions and take ownership of their work.
                </p>
              </div>
              
              {/* Inclusion Card - Featured */}
              <div className="bg-[#00D084] text-white rounded-lg p-12 text-center shadow-lg min-h-[450px] flex flex-col justify-between">
                <div>
                  <div className="text-white/70 text-sm font-medium mb-6">01</div>
                  <h3 className="text-2xl font-bold mb-4">Inclusion</h3>
                  <p className="text-sm leading-relaxed mb-8">
                    At Vice Golf, everyone is welcomed with open arms.
                  </p>
                </div>
                <div className="flex justify-center">
                  <svg className="w-20 h-20 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Teamwork Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm min-h-[400px] flex flex-col">
                <div className="text-gray-400 text-sm font-medium mb-6">02</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Teamwork</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  The Vice Golf team is unified by our vision that we strive towards each day, working together and achieving success along the way.
                </p>
              </div>
            </div>

            {/* Right Arrow */}
            <button className="absolute right-0 md:right-8 z-20 w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Enjoy The Benefits Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Enjoy The Benefits
          </h2>
          
          {/* Subtitle */}
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-base">
            Live well to embrace your vice. We believe that when life works, work works.
          </p>
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Hours that fit */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-[#00D084]/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-[#00D084]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Hours that fit</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Flexible work arrangements and remote work options cater to your work-life balance.
              </p>
            </div>

            {/* Secure your future */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-[#00D084]/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-[#00D084]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Secure your future</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                While retirement might seem distant to you, we've got you covered with options to enroll in our corporate pension plan.
              </p>
            </div>

            {/* Stay active */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-[#00D084]/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-[#00D084]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Stay active</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                With a golf simulator and putting green in the office, you can dial in your swing anytime. Plus, EGYM Wellpass is subsidized, so you can train for just 30€ a month.
              </p>
            </div>

            {/* Free lunch */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-[#00D084]/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-[#00D084]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Free lunch</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get a delicious lunch with Wolt every week for free, our way of helping you save while savoring.
              </p>
            </div>

            {/* Grow with us */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-[#00D084]/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-[#00D084]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Grow with us</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                We place great emphasis on your personal development, where you benefit from not only regular performance feedback but also an annual training budget.
              </p>
            </div>

            {/* Escape the routine */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-[#00D084]/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-[#00D084]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Escape the routine</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Within the EU, you're free to choose your workspace for two weeks a year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Embrace Your Vice Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Ready to Embrace Your Vice?
          </h2>
          
          {/* Subtitle */}
          <p className="text-center text-gray-400 mb-16 max-w-3xl mx-auto text-sm">
            At VICE GOLF, our hiring process includes several stages, offering you a chance to experience our culture while helping us recognize your skills and potential.
          </p>
          
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Initial Interview */}
            <div className="bg-[#1a1a1a] rounded-lg p-8">
              <div className="text-gray-500 text-xs font-medium mb-4">Step 1</div>
              <h3 className="text-xl font-bold mb-4">Initial Interview</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Let's be upfront: your resume and cover letter are your first impression. We'll review them carefully to understand your background and interest. If we see a fit, we'll reach out to schedule a conversation about the role, team, and company.
              </p>
            </div>

            {/* Step 2: Optional Test Assignment */}
            <div className="bg-[#1a1a1a] rounded-lg p-8">
              <div className="text-gray-500 text-xs font-medium mb-4">Step 2</div>
              <h3 className="text-xl font-bold mb-4">Optional: Test Assignment</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Depending on the role, we may ask you to complete a test assignment. This gives you a chance to showcase your skills in a realistic scenario and helps us evaluate how you approach challenges and deliver results.
              </p>
            </div>

            {/* Step 3: Interview Round */}
            <div className="bg-[#1a1a1a] rounded-lg p-8">
              <div className="text-gray-500 text-xs font-medium mb-4">Step 3</div>
              <h3 className="text-xl font-bold mb-4">Interview Round</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                In this stage, you'll meet members of the team and leadership. We'll dive deeper into your experience, discuss the role in detail, and explore how you can contribute. It's also your chance to ask questions and get to know us better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            See our Open Roles
          </h2>
          
          {/* Subtitle */}
          <p className="text-center text-gray-600 mb-12 text-sm">
            If you're passionate about golf and ready to make an impact, explore our exciting opportunities.
          </p>
          
          {/* Job Listings */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {/* Job 1 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-200">
              <div className="flex-grow mb-4 md:mb-0">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Commission Sales Representative: Canada - all genders welcome!
                </h3>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <span className="text-gray-600 text-sm">Canada</span>
                <span className="text-gray-600 text-sm">Permanent</span>
                <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                  Learn more
                </button>
              </div>
            </div>

            {/* Job 2 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-200">
              <div className="flex-grow mb-4 md:mb-0">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Independent sales representative - England & Wales - all genders welcome!
                </h3>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <span className="text-gray-600 text-sm">United Kingdom</span>
                <span className="text-gray-600 text-sm">Freelance</span>
                <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                  Learn more
                </button>
              </div>
            </div>

            {/* Job 3 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-200">
              <div className="flex-grow mb-4 md:mb-0">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Independent sales representative - Georgia - all genders welcome!
                </h3>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <span className="text-gray-600 text-sm">USA</span>
                <span className="text-gray-600 text-sm">Freelance</span>
                <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                  Learn more
                </button>
              </div>
            </div>

            {/* Job 4 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between py-6">
              <div className="flex-grow mb-4 md:mb-0">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Independent sales representative - Philadelphia/Eastern Pennsylvania - all genders welcome!
                </h3>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <span className="text-gray-600 text-sm">USA</span>
                <span className="text-gray-600 text-sm">Freelance</span>
                <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                  Learn more
                </button>
              </div>
            </div>
          </div>

          {/* See All Positions Button */}
          <div className="flex justify-center">
            <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
              See all positions
            </button>
          </div>
        </div>
      </section>

      {/* What It's Like to Work at Vice Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex-grow text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                What It's Like to Work at Vice?
              </h2>
              <p className="text-gray-600 text-sm">
                Explore what are our employees saying about working at Vice.
              </p>
            </div>
            <div className="hidden md:flex gap-2 ml-8">
              <button className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Employee Cards Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Employee 1 */}
            <div className="bg-white rounded-lg overflow-hidden group">
              <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop" 
                  alt="Linda Hertig"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1">Linda Hertig</h3>
                <p className="text-gray-600 text-xs mb-3">Head of P&C</p>
                <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Employee 2 */}
            <div className="bg-white rounded-lg overflow-hidden group">
              <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop" 
                  alt="Asa Knox"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1">Asa Knox</h3>
                <p className="text-gray-600 text-xs mb-3">Executive Assistant</p>
                <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Employee 3 */}
            <div className="bg-white rounded-lg overflow-hidden group">
              <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop" 
                  alt="Alex Campbell"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1">Alex Campbell</h3>
                <p className="text-gray-600 text-xs mb-3">Sr. Product Developer</p>
                <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Employee 4 */}
            <div className="bg-white rounded-lg overflow-hidden group">
              <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop" 
                  alt="Hugo Petrie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1">Hugo Petrie</h3>
                <p className="text-gray-600 text-xs mb-3">Finance Manager</p>
                <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Employee 5 */}
            <div className="bg-white rounded-lg overflow-hidden group">
              <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop" 
                  alt="James Taylor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1">James Taylor</h3>
                <p className="text-gray-600 text-xs mb-3">Content & Comms Manager</p>
                <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer is rendered by PageLayout */}
    </div>
  );
}
