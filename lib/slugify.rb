# encoding: utf-8
class Slugify
  def self.input(string)
    slug = I18n.transliterate(string.downcase)
    slug.gsub(/(bi)?(k|cycl)es?|company/i,'').gsub('+', 'plus').gsub(/([^A-Za-z0-9])/,' ').strip.gsub(/\s+/, '_')
  end
end
