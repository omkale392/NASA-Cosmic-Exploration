import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateSelector from '../components/DateSelector';
import { DateMode } from '../types/apod';

// today's string
function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function renderSelector(overrides: {
  selectedDate?: string;
  dateMode?: DateMode;
  onDateChange?: (d: string) => void;
  onModeChange?: (m: DateMode) => void;
} = {}) {
  const onDateChange = overrides.onDateChange ?? vi.fn();
  const onModeChange = overrides.onModeChange ?? vi.fn();
  render(
    <DateSelector
      selectedDate={overrides.selectedDate ?? todayStr()}
      onDateChange={onDateChange}
      dateMode={overrides.dateMode ?? 'day'}
      onModeChange={onModeChange}
    />
  );
  return { onDateChange, onModeChange };
}

describe('DateSelector', () => {
  it('renders all three tab labels', () => {
    renderSelector();
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
  });

  it('calls onModeChange with "month" when Month tab is clicked', () => {
    const { onModeChange } = renderSelector({ dateMode: 'day' });
    fireEvent.click(screen.getByText('Month'));
    expect(onModeChange).toHaveBeenCalledWith('month');
  });

  it('calls onModeChange with "year" when Year tab is clicked', () => {
    const { onModeChange } = renderSelector({ dateMode: 'day' });
    fireEvent.click(screen.getByText('Year'));
    expect(onModeChange).toHaveBeenCalledWith('year');
  });

  it('does not call onModeChange when the active tab is clicked again', () => {
    const { onModeChange } = renderSelector({ dateMode: 'day' });
    fireEvent.click(screen.getByText('Day'));
    expect(onModeChange).not.toHaveBeenCalled();
  });

  it('day cards before 1995-06-16 are disabled', () => {
    // Render with a date very close to the epoch so the strip includes pre-epoch days
    renderSelector({ selectedDate: '1995-06-16', dateMode: 'day' });
    // Buttons with opacity 0.28 are disabled — check cursor style or aria
    // The strip renders many buttons; disabled ones have cursor:not-allowed
    const buttons = screen.getAllByRole('button');
    // At least one button should have cursor:not-allowed (the disabled ones)
    const disabledButtons = buttons.filter(
      (b) => (b as HTMLElement).style.cursor === 'not-allowed'
    );
    expect(disabledButtons.length).toBeGreaterThan(0);
  });

  it('day cards after today are disabled', () => {
    renderSelector({ selectedDate: todayStr(), dateMode: 'day' });
    const buttons = screen.getAllByRole('button');
    const disabledButtons = buttons.filter(
      (b) => (b as HTMLElement).style.cursor === 'not-allowed'
    );
    expect(disabledButtons.length).toBeGreaterThan(0);
  });

  it('renders month grid when dateMode is "month"', () => {
    renderSelector({ dateMode: 'month' });
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Dec')).toBeInTheDocument();
  });

  it('renders year grid when dateMode is "year"', () => {
    renderSelector({ dateMode: 'year' });
    expect(screen.getByText('1995')).toBeInTheDocument();
  });
});
