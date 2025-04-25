import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FilterPanelProps {
  specialties: string[];
  selectedSpecialties: string[];
  consultationType: string;
  sortBy: string;
  onSpecialtyChange: (specialty: string) => void;
  onConsultationTypeChange: (type: string) => void;
  onSortChange: (sortType: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  specialties,
  selectedSpecialties,
  consultationType,
  sortBy,
  onSpecialtyChange,
  onConsultationTypeChange,
  onSortChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      {/* Consultation Type Filter */}
      <div className="space-y-2">
        <h3 
          data-testid="filter-header-moc" 
          className="font-medium text-lg border-b pb-2"
        >
          Consultation Mode
        </h3>
        <RadioGroup value={consultationType} onValueChange={onConsultationTypeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              data-testid="filter-video-consult" 
              value="video" 
              id="video"
            />
            <Label htmlFor="video">Video Consult</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              data-testid="filter-in-clinic" 
              value="clinic" 
              id="clinic"
            />
            <Label htmlFor="clinic">In Clinic</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Sort Filter */}
      <div className="space-y-2">
        <h3 
          data-testid="filter-header-sort" 
          className="font-medium text-lg border-b pb-2"
        >
          Sort
        </h3>
        <RadioGroup value={sortBy} onValueChange={onSortChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              data-testid="sort-fees" 
              value="fees" 
              id="fees"
            />
            <Label htmlFor="fees">Fees (Low to High)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              data-testid="sort-experience" 
              value="experience" 
              id="experience"
            />
            <Label htmlFor="experience">Experience (High to Low)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Specialties Filter */}
      <div className="space-y-2">
        <h3 
          data-testid="filter-header-speciality" 
          className="font-medium text-lg border-b pb-2"
        >
          Speciality
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {specialties.map((specialty) => {
            // Format for data-testid
            const formattedSpecialty = specialty.replace(/\//g, '-');
            
            return (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox
                  data-testid={`filter-specialty-${formattedSpecialty}`}
                  id={`specialty-${specialty}`}
                  checked={selectedSpecialties.includes(specialty)}
                  onCheckedChange={() => onSpecialtyChange(specialty)}
                />
                <Label htmlFor={`specialty-${specialty}`}>{specialty}</Label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
