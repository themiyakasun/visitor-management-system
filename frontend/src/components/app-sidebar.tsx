import * as React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
    },
    {
      title: 'Master Data',
      url: '#',
      items: [
        {
          title: 'Departments',
          url: '/departments',
        },
        {
          title: 'Roles',
          url: '/roles',
          isActive: true,
        },
        {
          title: 'Permissions',
          url: '/permissions',
        },
        {
          title: 'Users',
          url: '/users',
        },
      ],
    },
    {
      title: 'Operations',
      url: '#',
      items: [
        {
          title: 'Persons',
          url: '/persons',
        },
        {
          title: 'Vehicles',
          url: '/vehicles',
        },
        {
          title: 'Appointments',
          url: '/appointments',
        },
        {
          title: 'Gate Logs',
          url: '/gate-logs',
        },
      ],
    },
    {
      title: 'Reports',
      url: '#',
      items: [
        {
          title: 'Active Time Report',
          url: '/active-time-report',
        },
        {
          title: 'Time In/Out Report',
          url: '/time-in-out-report',
        },
        {
          title: 'Appoinment Report',
          url: '/appointment-log-report',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <GalleryVerticalEnd className='size-4' />
                </div>
                <div className='flex flex-col gap-0.5 leading-none'>
                  <span className='font-medium'>Documentation</span>
                  <span className=''>v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className='font-medium'>
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
