import React, { lazy } from 'react';
import { IProps } from './types';
const FurtherVisit = lazy(() => import('./Inner'))
export default (props: IProps) => {
  return <FurtherVisit {...props} />
}