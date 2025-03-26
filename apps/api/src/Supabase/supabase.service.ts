import { Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService extends SupabaseClient {
  async getMediaContent(id: string) {
    const { data, error } = await this.storage.from('media').list(id);
    if (error) {
      Logger.error(error);
      return [];
    }
    return data
      .filter((file) => file.metadata.size)
      .map((file) => ({
        id: file.id,
        filename: file.name,
        publicUrl: this.storage.from('media').getPublicUrl(`${file.name}`).data
          .publicUrl,
      }));
  }

  async uploadAndGetPubliUrl(
    path: string,
    attachements: Array<Express.Multer.File>,
  ) {
    await Promise.all(
      attachements.map((img) =>
        this.storage
          .from('media')
          .upload(`${path}/${img.originalname}`, img.buffer),
      ),
    );
    return attachements.map(
      (img) =>
        this.storage.from('media').getPublicUrl(`${path}/${img.originalname}`)
          .data.publicUrl,
    );
  }
}
