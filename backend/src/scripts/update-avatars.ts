import { executeQuery } from '@/config/database';
import logger from '@/config/logger';

async function updateUserAvatars() {
  try {
    logger.info('🔄 Starting avatar update for existing users...');

    // Update João Silva
    await executeQuery(
      'UPDATE users SET avatar_url = ? WHERE email = ?',
      [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
        'joao@example.com'
      ]
    );
    logger.info('✅ Updated João Silva avatar');

    // Update Maria Santos
    await executeQuery(
      'UPDATE users SET avatar_url = ? WHERE email = ?',
      [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&q=80',
        'maria@example.com'
      ]
    );
    logger.info('✅ Updated Maria Santos avatar');

    // Update Carlos Oliveira
    await executeQuery(
      'UPDATE users SET avatar_url = ? WHERE email = ?',
      [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
        'carlos@example.com'
      ]
    );
    logger.info('✅ Updated Carlos Oliveira avatar');

    logger.info('🎉 All user avatars updated successfully!');
  } catch (error) {
    logger.error('❌ Error updating user avatars:', error);
    throw error;
  }
}

// Run the update
updateUserAvatars()
  .then(() => {
    logger.info('✅ Avatar update completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('❌ Avatar update failed:', error);
    process.exit(1);
  });
