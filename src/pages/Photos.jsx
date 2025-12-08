import React, { useState } from 'react';
import { Camera, Trash2, Plus } from 'lucide-react';

export default function Photos({ data, onAdd, onDelete }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic size check (Limit to 1MB roughly)
    if (file.size > 1024 * 1024) {
      alert("File too large! Please choose an image under 1MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onAdd({
        date: new Date().toISOString().split('T')[0],
        imgData: reader.result,
        note: 'Progress Check'
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Photos</h2>
           <p className="text-gray-500 text-sm">Visual tracking (Saved locally)</p>
        </div>
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 font-medium transition-colors">
          <Camera size={20} />
          <span>{isUploading ? 'Saving...' : 'Add Photo'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {data.map(photo => (
           <div key={photo.id} className="group relative bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm break-inside-avoid">
             <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900 relative">
               <img src={photo.imgData} alt="Progress" className="w-full h-full object-cover" />
             </div>
             <div className="mt-3 px-1 flex justify-between items-center">
               <span className="font-bold text-gray-900 dark:text-white text-sm">{photo.date}</span>
               <button 
                 onClick={() => onDelete(photo.id)}
                 className="text-gray-400 hover:text-red-500 transition-colors"
               >
                 <Trash2 size={16} />
               </button>
             </div>
           </div>
         ))}
         
         {/* Empty State */}
         {data.length === 0 && (
           <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">
              <Camera size={48} className="mb-4 opacity-50" />
              <p>No photos yet. Snap a selfie to track progress!</p>
           </div>
         )}
      </div>
    </div>
  );
}