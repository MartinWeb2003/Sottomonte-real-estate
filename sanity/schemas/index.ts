import { localizedString, localizedText, localizedBlockContent } from './localized';
import { property } from './property';
import { location } from './location';
import { testimonial } from './testimonial';
import { teamMember } from './teamMember';

export const schemaTypes = [
  localizedString,
  localizedText,
  localizedBlockContent,
  property,
  location,
  testimonial,
  teamMember,
];
