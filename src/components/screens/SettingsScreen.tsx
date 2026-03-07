import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectHasSavedCredentials } from '@/features/core/settings/slice/settingsSelectors';
import { saveCredentialInputs } from '@/features/core/settings/slice/settingsWorkflowActions';
import {
  requestDropboxValidation,
  requestLeonardoValidation,
  setCurrentPage,
  setDropboxAccessTokenInput,
  setLeonardoApiKeyInput,
} from '@/features/core/ui/slice/uiActions';
import {
  selectCanTestDropboxToken,
  selectCanTestLeonardoApiKey,
  selectDropboxAccessTokenInput,
  selectDropboxValidationMessage,
  selectDropboxValidationStatus,
  selectHasCredentialInputs,
  selectLeonardoApiKeyInput,
  selectLeonardoValidationMessage,
  selectLeonardoValidationStatus,
} from '@/features/core/ui/slice/uiSelectors';
import { SettingsCredentialsCard } from '@/components/elements/unique/SettingsCredentialsCard';

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  const leonardoApiKeyInput = useAppSelector(selectLeonardoApiKeyInput);
  const dropboxAccessTokenInput = useAppSelector(selectDropboxAccessTokenInput);
  const showBackToApp = useAppSelector(selectHasSavedCredentials);
  const canSaveCredentials = useAppSelector(selectHasCredentialInputs);
  const canTestLeonardo = useAppSelector(selectCanTestLeonardoApiKey);
  const canTestDropbox = useAppSelector(selectCanTestDropboxToken);
  const leonardoValidationStatus = useAppSelector(selectLeonardoValidationStatus);
  const leonardoValidationMessage = useAppSelector(selectLeonardoValidationMessage);
  const dropboxValidationStatus = useAppSelector(selectDropboxValidationStatus);
  const dropboxValidationMessage = useAppSelector(selectDropboxValidationMessage);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto mt-8 max-w-xl px-4"
    >
      <SettingsCredentialsCard
        leonardoApiKeyInput={leonardoApiKeyInput}
        dropboxAccessTokenInput={dropboxAccessTokenInput}
        leonardoValidationStatus={leonardoValidationStatus}
        dropboxValidationStatus={dropboxValidationStatus}
        leonardoValidationMessage={leonardoValidationMessage}
        dropboxValidationMessage={dropboxValidationMessage}
        canTestLeonardo={canTestLeonardo}
        canTestDropbox={canTestDropbox}
        canSaveCredentials={canSaveCredentials}
        showBackToApp={showBackToApp}
        onLeonardoApiKeyInputChange={(value) => dispatch(setLeonardoApiKeyInput(value))}
        onDropboxAccessTokenInputChange={(value) => dispatch(setDropboxAccessTokenInput(value))}
        onTestLeonardo={() => dispatch(requestLeonardoValidation())}
        onTestDropbox={() => dispatch(requestDropboxValidation())}
        onBackToApp={() => dispatch(setCurrentPage('home'))}
        onSaveCredentials={() => dispatch(saveCredentialInputs())}
      />
    </motion.div>
  );
}
