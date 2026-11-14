import JSZip from 'jszip';
import { buildAiPromptsFiles } from './catalog/aiPrompts.js';
import { buildAutomationFiles } from './catalog/automationFlows.js';
import { buildNotionAndFinanceFiles } from './catalog/notionAndFinance.js';
import { buildDesignKitFiles } from './catalog/designAndSocial.js';
import { buildPlaybookAndSaasFiles } from './catalog/playbooksAndSaas.js';

export async function buildProductZip({ product, order, licenseKey }) {
  const zip = new JSZip();
  const folderName = product.slug || product.id;
  const root = zip.folder(folderName);

  const readme = `# ${product.title}

Thank you for your purchase from **StackVault**!

## Order & License Details
- **Order ID:** ${order.id}
- **Customer:** ${order.customerName} (${order.customerEmail})
- **License Key:** \`${licenseKey}\`
- **Purchase Date:** ${order.createdAt}
- **License Type:** Commercial & Unlimited Personal Use (Non-Resale)

---

## What's Included
${(product.highlights || []).map((h) => `- ${h}`).join('\n')}

## Preview / Reference
\`\`\`
${product.previewSnippet?.code || 'See files inside this archive.'}
\`\`\`
`;

  root.file('README.md', readme);

  if (product.id === 'prod-ai-vault') {
    buildAiPromptsFiles(root, product, licenseKey);
  } else if (product.id === 'prod-automation-flows') {
    buildAutomationFiles(root, product);
  } else if (product.id === 'prod-notion-os') {
    buildNotionAndFinanceFiles(root, product, licenseKey);
  } else if (product.id === 'prod-darkforge-ui') {
    buildDesignKitFiles(root, product, licenseKey);
  } else if (product.id === 'prod-launch-playbook') {
    buildPlaybookAndSaasFiles(root, product, licenseKey);
  } else {
    // Admin-created custom products
    const files = product.deliverables?.length
      ? product.deliverables
      : ['01_Main_Resource.md', '02_Quick_Start_Checklist.md'];
    for (const file of files) {
      if (file.endsWith('.json')) {
        root.file(
          file,
          JSON.stringify(
            {
              product: product.title,
              licenseKey,
              highlights: product.highlights || [],
              snippet: product.previewSnippet?.code || ''
            },
            null,
            2
          )
        );
      } else {
        root.file(
          file,
          `# ${product.title} — ${file}\n\n${product.description}\n\n## Highlights\n${(product.highlights || [])
            .map((h) => `- ${h}`)
            .join('\n')}\n\n## Reference\n${product.previewSnippet?.code || ''}\n`
        );
      }
    }
  }

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}
