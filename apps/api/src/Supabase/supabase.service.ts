import { Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService extends SupabaseClient {
  async getDonationMedia() {
    const { data, error } = await this.storage.from('media').list();
    if (error) {
      Logger.error(error);
      return [];
    }
    return data
      .filter((file) => file.metadata.size)
      .map(
        (file) =>
          this.storage.from('media').getPublicUrl(`${file.name}`).data
            .publicUrl,
      );
  }

  async uploadAndGetPubliUrl(attachements: Array<Express.Multer.File>) {
    await Promise.all(
      attachements.map((img) =>
        this.storage
          .from('media')
          .upload(`${img.originalname}`, img.buffer, {
            contentType: img.mimetype,
          }),
      ),
    );
    return attachements.map(
      (img) =>
        this.storage.from('media').getPublicUrl(`${img.originalname}`).data
          .publicUrl,
    );
  }

  getPublicUrl(fileName: string) {
    return this.storage.from('media').getPublicUrl(`${fileName}`).data
      .publicUrl;
  }
}
