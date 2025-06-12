import { render, screen, waitFor } from '@testing-library/react';
import SalesPage from './page';

jest.mock('@/components/AdminSidebar', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/AdminPageHeader', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

const mockGet = jest.fn();
jest.mock('@/lib/apiClient', () => ({
  __esModule: true,
  default: { get: mockGet },
}));

describe('SalesPage totals', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-10T12:00:00Z'));
    localStorage.setItem('tenantId', 't1');
    mockGet.mockResolvedValue({
      data: {
        reservations: [
          {
            date: '2024-01-10T10:00:00Z',
            reservationItems: [{ serviceId: '1', service: { name: 'A', price: 100 } }],
          },
          {
            date: '2024-01-09T10:00:00Z',
            reservationItems: [{ serviceId: '2', service: { name: 'B', price: 200 } }],
          },
          {
            date: '2024-01-02T10:00:00Z',
            reservationItems: [{ serviceId: '3', service: { name: 'C', price: 300 } }],
          },
          {
            date: '2023-12-31T10:00:00Z',
            reservationItems: [{ serviceId: '4', service: { name: 'D', price: 400 } }],
          },
        ],
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    mockGet.mockReset();
    localStorage.clear();
  });

  it('calculates totals for today, this week and this month', async () => {
    render(<SalesPage />);

    await waitFor(() => expect(mockGet).toHaveBeenCalled());

    expect(await screen.findByText('100')).toBeInTheDocument(); // today
    expect(await screen.findByText('300')).toBeInTheDocument(); // this week
    expect(await screen.findByText('600')).toBeInTheDocument(); // this month
  });
});
