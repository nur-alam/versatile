import config from '@/config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import { fetchUtil } from '@/utils/request-utils';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { AnyObject } from '@/utils/utils';