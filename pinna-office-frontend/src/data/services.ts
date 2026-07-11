import type { Service } from '@/types';

export const sampleServices: Service[] = [
  {
    id: 's1',
    name: 'IT Support',
    description: 'Onsite and remote IT support for offices of all sizes.',
    icon: '/assets/icons/support.svg',
    features: ['Helpdesk', 'Managed services', 'Onsite visits'],
    price: 199,
  },
  {
    id: 's2',
    name: 'Network Setup',
    description: 'Design and install wired and wireless office networks.',
    icon: '/assets/icons/network.svg',
    features: ['Wired/wireless', 'Security hardening', 'QoS'],
    price: 499,
  },
  {
    id: 's3',
    name: 'Cloud Migration',
    description: 'Migrate on-prem systems to cloud providers securely.',
    icon: '/assets/icons/cloud.svg',
    features: ['Assessment', 'Migration', 'Optimization'],
    price: 999,
  },
  {
    id: 's4',
    name: 'Printer Fleet Management',
    description: 'Supply, maintain and service your office printers.',
    icon: '/assets/icons/printer.svg',
    features: ['Supply management', 'Preventive maintenance'],
    price: 79,
  },
];

export default sampleServices;
