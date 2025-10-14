import { ChangeEvent, useState } from 'react';

interface UseImageUploadOptions {
	multiple?: boolean;
}

interface UploadedFile {
	file: File;
	preview: string;
}

export const useImageUpload = ({ multiple = false }: UseImageUploadOptions = {}) => {
	const [uploads, setUploads] = useState<UploadedFile[]>([]);

	const generatePreviews = (fileList: File[]) => {
		const previewPromises = fileList.map(
			(file) =>
				new Promise<UploadedFile>((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						resolve({ file, preview: reader.result as string });
					};
					reader.readAsDataURL(file);
				}),
		);
		return Promise.all(previewPromises);
	};

	const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files;
		if (!selected.length) return;

		const selectedFiles = Array.from(selected);
		const newUploads = await generatePreviews(selectedFiles);

		setUploads((prev) =>
			multiple ? [...prev, ...newUploads] : newUploads,
		);
	};

	const removeFileByName = (fileName: string) => {
		setUploads((prev) => prev.filter((item) => item.file.name !== fileName));
	};

	const resetFiles = () => {
		setUploads([]);
	};

	return {
		files: uploads.map((u) => u.file),
		previews: uploads.map((u) => u.preview),
		handleChange,
		removeFileByName,
		resetFiles,
	};
};
