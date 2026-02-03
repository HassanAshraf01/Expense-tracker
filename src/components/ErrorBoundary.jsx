import React from 'react';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("ErrorBoundary caught an error", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white p-4">
//           <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-lg w-full">
//             <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
//             <p className="text-slate-300 mb-4">The application encountered an error and could not render.</p>
//             <pre className="bg-slate-900/50 p-4 rounded-lg text-sm text-red-300 overflow-auto max-h-48">
//               {this.state.error?.toString()}
//             </pre>
//             <button
//               onClick={() => {
//                 localStorage.removeItem('expenses');
//                 window.location.reload();
//               }}
//               className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors cursor-pointer"
//             >
//               Reset Data & Reload
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;

// Temporary pass-through component to prevent build errors while the main logic is commented out
const ErrorBoundary = ({ children }) => <>{children}</>;
export default ErrorBoundary;
