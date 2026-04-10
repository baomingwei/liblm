import React, { lazy } from 'react';
import { IProps } from './types';
const PostpartumVisit = lazy(() => import('./Inner'))
export default (props: IProps) => {
  return <PostpartumVisit {...props} />
}