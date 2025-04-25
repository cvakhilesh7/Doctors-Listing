import React from "react";
import { Doctor } from "../types/doctor";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <Card 
      data-testid="doctor-card" 
      className="p-4 mb-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4 lg:w-1/5">
          <img
            src={doctor.image || "/placeholder.svg"}
            alt={`Dr. ${doctor.name}`}
            className="w-full h-auto rounded-md object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="md:w-3/4 lg:w-4/5 space-y-2">
          <h3 
            data-testid="doctor-name" 
            className="text-xl font-semibold text-medical-800"
          >
            Dr. {doctor.name}
          </h3>
          
          <div className="flex flex-wrap gap-2 my-2">
            {doctor.specialty.map((spec, index) => (
              <Badge 
                key={index} 
                data-testid="doctor-specialty" 
                variant="outline" 
                className="bg-medical-50 text-medical-800 border-medical-200"
              >
                {spec}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 text-sm">
            <span data-testid="doctor-experience">
              <strong>{doctor.experience}+ years</strong> experience
            </span>
            <span data-testid="doctor-fee">
              <strong>₹{doctor.fees}</strong> consultation fee
            </span>
            <span>
              <strong>{doctor.clinic}</strong>
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            {doctor.availability.video && (
              <Button 
                variant="outline" 
                className="border-medical-500 text-medical-700 hover:bg-medical-50"
              >
                Video Consult
              </Button>
            )}
            {doctor.availability.in_clinic && (
              <Button 
                variant="outline"
                className="border-medical-500 text-medical-700 hover:bg-medical-50"
              >
                Book Appointment
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DoctorCard;
