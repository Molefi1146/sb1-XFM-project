import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Mail, Lock, User, Building, Briefcase } from 'lucide-react';

const roleSchema = z.enum(['investor', 'project_creator', 'vendor']);

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: roleSchema,
  organization: z.string().optional(),
  experience: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const roleQuestions = {
  investor: {
    title: 'Investment Preferences',
    questions: [
      { id: 'investmentRange', label: 'Preferred Investment Range', type: 'select', options: [
        '< $10,000',
        '$10,000 - $50,000',
        '$50,000 - $100,000',
        '> $100,000'
      ]},
      { id: 'projectTypes', label: 'Preferred Project Types', type: 'multiselect', options: [
        'Crop Farming',
        'Livestock',
        'Aquaculture',
        'Vertical Farming',
        'Organic Farming'
      ]},
    ]
  },
  project_creator: {
    title: 'Project Experience',
    questions: [
      { id: 'farmingExperience', label: 'Years of Farming Experience', type: 'select', options: [
        '< 2 years',
        '2-5 years',
        '5-10 years',
        '> 10 years'
      ]},
      { id: 'certifications', label: 'Certifications', type: 'multiselect', options: [
        'Organic Farming',
        'Sustainable Agriculture',
        'GAP Certification',
        'Other'
      ]},
    ]
  },
  vendor: {
    title: 'Service Details',
    questions: [
      { id: 'serviceType', label: 'Type of Service/Resource', type: 'multiselect', options: [
        'Equipment Rental',
        'Transportation',
        'Storage Facilities',
        'Labor Services',
        'Technical Consulting'
      ]},
      { id: 'serviceArea', label: 'Service Area', type: 'select', options: [
        'Local (< 50 miles)',
        'Regional',
        'National',
        'International'
      ]},
    ]
  }
};

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [roleAnswers, setRoleAnswers] = useState<Record<string, any>>({});
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = (data: RegisterForm) => {
    if (step === 1) {
      setStep(2);
    } else {
      const finalData = {
        ...data,
        roleSpecificInfo: roleAnswers
      };
      console.log('Registration data:', finalData);
      // Here you would typically handle user registration
      navigate('/dashboard');
    }
  };

  const handleRoleAnswerChange = (questionId: string, value: string | string[]) => {
    setRoleAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-green-600 hover:text-green-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {step === 1 ? (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('name')}
                      type="text"
                      className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('email')}
                      type="email"
                      className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('password')}
                      type="password"
                      className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Create a password"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    I want to join as
                  </label>
                  <div className="mt-1">
                    <select
                      {...register('role')}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select your role</option>
                      <option value="investor">Investor</option>
                      <option value="project_creator">Agricultural Project Creator</option>
                      <option value="vendor">Resources & Service Vendor</option>
                    </select>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                    Organization (Optional)
                  </label>
                  <div className="mt-1 relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('organization')}
                      type="text"
                      className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your organization name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Experience (Optional)
                  </label>
                  <div className="mt-1 relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('experience')}
                      type="text"
                      className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Years of relevant experience"
                    />
                  </div>
                </div>
              </>
            ) : (
              selectedRole && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {roleQuestions[selectedRole].title}
                  </h3>
                  {roleQuestions[selectedRole].questions.map((question) => (
                    <div key={question.id}>
                      <label className="block text-sm font-medium text-gray-700">
                        {question.label}
                      </label>
                      <div className="mt-1">
                        {question.type === 'select' ? (
                          <select
                            onChange={(e) => handleRoleAnswerChange(question.id, e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="">Select an option</option>
                            {question.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="space-y-2">
                            {question.options.map((option) => (
                              <label key={option} className="flex items-center">
                                <input
                                  type="checkbox"
                                  value={option}
                                  onChange={(e) => {
                                    const currentAnswers = roleAnswers[question.id] || [];
                                    const newAnswers = e.target.checked
                                      ? [...currentAnswers, option]
                                      : currentAnswers.filter((a: string) => a !== option);
                                    handleRoleAnswerChange(question.id, newAnswers);
                                  }}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            <div className="flex justify-between">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {step === 1 ? 'Next' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}