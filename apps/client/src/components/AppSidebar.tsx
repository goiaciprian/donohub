import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useHasPermissions } from '@/hooks/useHasPermissions';
import { PermissionsType } from '@donohub/shared';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';

export const AppSidebar = () => {
  const { setOpen } = useSidebar();
  const { hasPermissions, permissions } = useHasPermissions();
  const { t } = useTranslation();
  const { lang } = useParams();

  const sidebarRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(sidebarRef, () => setOpen(false));

  const permissionsConfiguration = React.useCallback(() => {
    const initial: {
      donationsPermissions: PermissionsType[];
      commentsPermissions: PermissionsType[];
    } = { donationsPermissions: [], commentsPermissions: [] };
    return permissions.reduce((obj, currentValue) => {
      if (currentValue.startsWith('donation')) {
        obj.donationsPermissions.push(currentValue);
      } else {
        obj.commentsPermissions.push(currentValue);
      }
      return obj;
    }, initial);
  }, [permissions]);

  if (!hasPermissions) {
    return null;
  }

  const { commentsPermissions, donationsPermissions } =
    permissionsConfiguration();

  return (
    <Sidebar className="dark" ref={sidebarRef}>
      <SidebarHeader>
        <h1 className="text-white m-auto py-5">
          {t('internal.adminManagement.title')}
        </h1>
      </SidebarHeader>
      <SidebarContent>
        {donationsPermissions.length !== 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {t('internal.evaluation.donation.title')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {donationsPermissions.includes('donation:evaluate') && (
                <>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="text-white">
                        <NavLink
                          to={`/${lang}/admin/evaluate/donations`}
                          viewTransition
                        >
                          <span>
                            {t(`internal.evaluation.donation.evaluate`)}
                          </span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>

                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="text-white">
                        <NavLink
                          to={`/${lang}/admin/evaluated/donations`}
                          viewTransition
                        >
                          <span>Evaluated by me</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {commentsPermissions.length !== 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {t('internal.evaluation.comment.title')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {commentsPermissions.includes('comments:evaluate') && (
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-white">
                      <NavLink
                        to={`/${lang}/admin/evaluate/comments`}
                        viewTransition
                      >
                        <span>{t(`internal.evaluation.comment.evaluate`)}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
