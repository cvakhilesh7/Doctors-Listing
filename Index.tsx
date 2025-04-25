
import React, { useEffect, useState } from "react";
import AutocompleteSearch from "@/components/AutocompleteSearch";
import FilterPanel from "@/components/FilterPanel";
import DoctorCard from "@/components/DoctorCard";
import { fetchDoctors, getAllSpecialties } from "@/services/doctorService";
import { Doctor } from "@/types/doctor";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [consultationType, setConsultationType] = useState("");
  const [sortBy, setSortBy] = useState(""); 
  
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL params on initial load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const queryName = searchParams.get("name");
    if (queryName) setSearchQuery(queryName);
    
    const queryConsultation = searchParams.get("consultation");
    if (queryConsultation) setConsultationType(queryConsultation);
    
    const querySort = searchParams.get("sort");
    if (querySort) setSortBy(querySort);
    
    const querySpecialties = searchParams.get("specialties");
    if (querySpecialties) {
      setSelectedSpecialties(querySpecialties.split(","));
    }
  }, [location.search]);
  
  // Fetch doctors data
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();
        setDoctors(data);
        setFilteredDoctors(data);
        setSpecialties(getAllSpecialties(data));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError(true);
        setLoading(false);
        toast.error("Failed to load doctors data. Please try again later.");
      }
    };
    
    loadDoctors();
  }, []);
  
  // Apply filters and update URL whenever filters change
  useEffect(() => {
    if (doctors.length === 0) return;
    
    let filtered = [...doctors];
    
    // Apply name search filter
    if (searchQuery) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply consultation type filter
    if (consultationType) {
      if (consultationType === "video") {
        filtered = filtered.filter(doctor => doctor.availability.video);
      } else if (consultationType === "clinic") {
        filtered = filtered.filter(doctor => doctor.availability.in_clinic);
      }
    }
    
    // Apply specialty filters
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter(doctor =>
        doctor.specialty.some(specialty => selectedSpecialties.includes(specialty))
      );
    }
    
    // Apply sorting
    if (sortBy === "fees") {
      filtered.sort((a, b) => a.fees - b.fees);
    } else if (sortBy === "experience") {
      filtered.sort((a, b) => b.experience - a.experience);
    }
    
    setFilteredDoctors(filtered);
    
    // Update URL with filters
    updateQueryParams();
  }, [searchQuery, selectedSpecialties, consultationType, sortBy, doctors]);
  
  // Update URL query parameters
  const updateQueryParams = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set("name", searchQuery);
    if (consultationType) params.set("consultation", consultationType);
    if (sortBy) params.set("sort", sortBy);
    if (selectedSpecialties.length > 0) {
      params.set("specialties", selectedSpecialties.join(","));
    }
    
    navigate({ search: params.toString() }, { replace: true });
  };
  
  // Handle search from autocomplete
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle specialty filter changes
  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty);
      } else {
        return [...prev, specialty];
      }
    });
  };
  
  // Handle consultation type changes
  const handleConsultationTypeChange = (type: string) => {
    setConsultationType(prev => prev === type ? "" : type);
  };
  
  // Handle sort changes
  const handleSortChange = (sortType: string) => {
    setSortBy(prev => prev === sortType ? "" : sortType);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-medical-600 border-medical-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-medium text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">
            We couldn't load the doctor information. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-medical-800 mb-4">Find Doctors</h1>
          <AutocompleteSearch doctors={doctors} onSearch={handleSearch} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Section */}
          <aside className="md:w-1/4 lg:w-1/5">
            <FilterPanel
              specialties={specialties}
              selectedSpecialties={selectedSpecialties}
              consultationType={consultationType}
              sortBy={sortBy}
              onSpecialtyChange={handleSpecialtyChange}
              onConsultationTypeChange={handleConsultationTypeChange}
              onSortChange={handleSortChange}
            />
          </aside>

          {/* Doctor List Section */}
          <section className="md:w-3/4 lg:w-4/5">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {filteredDoctors.length} Doctors found
              </h2>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <h3 className="text-xl font-medium mb-2">No doctors found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters to find more results.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
