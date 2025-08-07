
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  civicIssuesService, 
  campaignsService, 
  eventsService, 
  zoningViolationsService,
  workerRegistryService,
  governmentOfficialsService,
  cmsContentService,
  notificationsService,
  userProfileService
} from '@/lib/supabase-service';

// Civic Issues Hooks
export const useCivicIssues = () => {
  return useQuery({
    queryKey: ['civic-issues'],
    queryFn: civicIssuesService.getAllIssues,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: civicIssuesService.createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['civic-issues'] });
    },
  });
};

// Campaigns Hooks
export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsService.getApprovedCampaigns,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: campaignsService.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

// Events Hooks
export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventsService.getApprovedEvents,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

// Zoning Violations Hooks
export const useZoningViolations = () => {
  return useQuery({
    queryKey: ['zoning-violations'],
    queryFn: zoningViolationsService.getAllViolations,
  });
};

export const useReportViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: zoningViolationsService.reportViolation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zoning-violations'] });
    },
  });
};

// Worker Registry Hooks
export const useWorkers = () => {
  return useQuery({
    queryKey: ['workers'],
    queryFn: workerRegistryService.getVerifiedWorkers,
  });
};

export const useRegisterWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workerRegistryService.registerAsWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });
};

// Government Officials Hooks
export const useGovernmentOfficials = () => {
  return useQuery({
    queryKey: ['government-officials'],
    queryFn: governmentOfficialsService.getAllOfficials,
  });
};

// CMS Content Hooks
export const useCMSContent = (contentType?: string) => {
  return useQuery({
    queryKey: ['cms-content', contentType],
    queryFn: () => cmsContentService.getPublishedContent(contentType),
  });
};

export const useCreateContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cmsContentService.createContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-content'] });
    },
  });
};

// Notifications Hooks
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getUserNotifications,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// User Profile Hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: userProfileService.getCurrentProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userProfileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

export const useUserType = () => {
  return useQuery({
    queryKey: ['user-type'],
    queryFn: userProfileService.getUserType,
  });
};
