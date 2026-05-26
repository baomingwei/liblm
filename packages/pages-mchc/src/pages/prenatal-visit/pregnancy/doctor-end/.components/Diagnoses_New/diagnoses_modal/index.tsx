import { MyLazyComponent } from "@lm_fe/components";
import React from "react";
import { lazy } from "react";
import { IDiagnosesTemplate } from './types'
export { IDiagnosesTemplate }
const Inner = lazy(() => import('./Inner'))
export default function DoctorEnd_Diagnoses_Modal(props: IDiagnosesTemplate) {
  return <MyLazyComponent>
    <Inner {...props} />
  </MyLazyComponent>
}
