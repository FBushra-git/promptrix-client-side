"use client"; // Required for usePathname
import { usePathname } from 'next/navigation';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { ToastContainer } from 'react-toastify';

export default function CreatorLayout({ children }) {
  const pathname = usePathname();
  
  // Logic: Hide sidebar if the path includes the details route
  // Change '/prompts/' to match your actual URL structure
  const isDetailsPage = pathname.includes('/prompts/') && pathname.split('/').length > 4;

  return (
    <div className="min-h-screen flex text-white">
      {!isDetailsPage && <DashboardSidebar />}
      <div className={`flex-1 ${isDetailsPage ? 'w-full' : ''}`}>
        {children}
         <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      </div>
    </div>
  );
}