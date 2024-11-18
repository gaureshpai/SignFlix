'use client'

import React, { useState } from 'react';
import { PlusCircle, Calendar, Pill, Stethoscope, FlaskConical, Shield, Syringe, Slice } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MedicationForm } from '@/components/forms/medication';
import { DiagnosisForm } from '@/components/forms/diagnosis';
import { LabForm } from '@/components/forms/lab';
import { AllergyForm } from '@/components/forms/allergy';
import { ProcedureForm } from '@/components/forms/procedure';
import { VitalSignForm } from '@/components/forms/vitalsign';
import { ImmunizationForm } from '@/components/forms/immunization';

interface AddEncounterDataDropdownProps {
  encounterId: string;
}

const AddEncounterDataDropdown: React.FC<AddEncounterDataDropdownProps> = ({ encounterId }) => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const closeDialog = () => setOpenDialog(null);

  const forms = {
    medication: {
      title: "Add Medication",
      icon: Pill,
      component: MedicationForm
    },
    diagnosis: {
      title: "Add Diagnosis",
      icon: Stethoscope,
      component: DiagnosisForm
    },
    lab: {
      title: "Add Lab",
      icon: FlaskConical,
      component: LabForm
    },
    allergy: {
      title: "Add Allergy",
      icon: Shield,
      component: AllergyForm
    },
    procedure: {
      title: "Add Procedure",
      icon: Slice,
      component: ProcedureForm
    },
    vitalSigns: {
      title: "Add Vital Signs",
      icon: Stethoscope,
      component: VitalSignForm
    },
    Immunization: {
      title: "Add Immunization",
      icon: Syringe,
      component: ImmunizationForm
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.entries(forms).map(([key, { title, icon: Icon }]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setOpenDialog(key)}
              className="flex items-center"
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{title}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {Object.entries(forms).map(([key, { title, component: FormComponent }]) => (
        <Dialog
          key={key}
          open={openDialog === key}
          onOpenChange={(open) => !open && closeDialog()}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <FormComponent
              encounterId={encounterId}
              onSuccess={closeDialog}
            />
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
};

export default AddEncounterDataDropdown;