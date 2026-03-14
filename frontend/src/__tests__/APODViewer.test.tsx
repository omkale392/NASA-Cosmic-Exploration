import React from 'react';
import { render, screen } from '@testing-library/react';
import APODViewer from '../components/APODViewer';
import { APODResponse } from '../types/apod';

const MOCK_APOD: APODResponse = {
  date: '2024-03-14',
  title: 'Pillars of Creation',
  explanation: 'The famous pillars of creation are star-forming regions in the Eagle Nebula. '.repeat(3),
  url: 'https://apod.nasa.gov/apod/image/test.jpg',
  hdurl: 'https://apod.nasa.gov/apod/image/test_hd.jpg',
  media_type: 'image',
  service_version: 'v1',
};

const MOCK_VIDEO_APOD: APODResponse = {
  ...MOCK_APOD,
  media_type: 'video',
  url: 'https://www.youtube.com/embed/test',
  hdurl: undefined,
};

const defaultProps = {
  apod: null,
  loading: false,
  error: null,
  onGenerateBriefing: vi.fn(),
  briefingLoading: false,
};

describe('APODViewer', () => {
  it('renders "ACQUIRING SIGNAL" text when loading is true', () => {
    render(<APODViewer {...defaultProps} loading={true} />);
    expect(screen.getByText(/ACQUIRING SIGNAL/i)).toBeInTheDocument();
  });

  it('renders the error message when error prop is set', () => {
    render(<APODViewer {...defaultProps} error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders "Try a different date" hint in error state', () => {
    render(<APODViewer {...defaultProps} error="Something went wrong" />);
    expect(screen.getByText(/try a different date/i)).toBeInTheDocument();
  });

  it('renders the APOD title when valid apod is provided', () => {
    render(<APODViewer {...defaultProps} apod={MOCK_APOD} />);
    expect(screen.getByText('Pillars of Creation')).toBeInTheDocument();
  });

  it('renders part of the explanation text', () => {
    render(<APODViewer {...defaultProps} apod={MOCK_APOD} />);
    // explanation is in a <p> tag; use getAllByText since title also matches
    const matches = screen.getAllByText(/pillars of creation/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('renders an image element for image media_type', () => {
    render(<APODViewer {...defaultProps} apod={MOCK_APOD} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', MOCK_APOD.hdurl);
  });

  it('renders an iframe for video media_type', () => {
    render(<APODViewer {...defaultProps} apod={MOCK_VIDEO_APOD} />);
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', MOCK_VIDEO_APOD.url);
  });

  it('renders "HD" badge when hdurl is present', () => {
    render(<APODViewer {...defaultProps} apod={MOCK_APOD} />);
    expect(screen.getByText('HD')).toBeInTheDocument();
  });

  it('renders the Generate AI Mission Briefing button', () => {
    render(<APODViewer {...defaultProps} apod={MOCK_APOD} />);
    expect(screen.getByText(/generate ai mission briefing/i)).toBeInTheDocument();
  });

  it('shows "Analyzing..." text when briefingLoading is true', () => {
    render(<APODViewer {...defaultProps} apod={MOCK_APOD} briefingLoading={true} />);
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
  });

  it('renders null when apod is null and not loading/error', () => {
    const { container } = render(<APODViewer {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });
});
