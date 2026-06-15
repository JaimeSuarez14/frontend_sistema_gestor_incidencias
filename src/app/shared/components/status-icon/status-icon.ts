import { Component, input } from '@angular/core';
import { requiredError } from '@angular/forms/signals';

@Component({
  selector: 'app-status-icon',
  imports: [],
  templateUrl: './status-icon.html',
  styleUrl: './status-icon.css',
})
export class StatusIcon {
  isValid = input.required<boolean>();
}
