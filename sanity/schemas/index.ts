import {
  localizedString,
  localizedText,
  localizedStringList,
  localizedBlockContent,
} from './localized';
import { property } from './property';
import { guide } from './guide';
import { location } from './location';
import { testimonial } from './testimonial';
import { teamMember } from './teamMember';

export const schemaTypes = [
  localizedString,
  localizedText,
  localizedStringList,
  localizedBlockContent,
  property,
  guide,
  location,
  testimonial,
  teamMember,
];
