clear;clc;
%3.3
pr0=[-103,-100,-96,-99,-100];
n0=-134;ik=[-112,-108,-111;-113,-115,-113; -108,-109,-103;-109,-113,-114;-113,-112,-113];
pr0=10.^(pr0/10);
n0=10^(n0/10);
ik=10.^(ik/10);
for k=1:5;
sinr(k)=pr0(k)/(n0+sum(ik(k,:)));
end
sinr=10*log10(sinr);
snr=[7.6,8.2,9.8,8.4,7.2];

%3.5
mean_sinr = mean(sinr);
std_sinr = std(sinr);
mean_snr = mean(snr);
std_snr = std(snr);
conf_interval = 1.96; 
sinr_ci = [mean_sinr - conf_interval * std_sinr, mean_sinr + conf_interval * std_sinr];
snr_ci = [mean_snr - conf_interval * std_snr, mean_snr + conf_interval * std_snr];

bar(sinr);
hold on;
errorbar(1:5, sinr, std_sinr * ones(1, 5), 'r.', 'LineWidth', 1.5);
xlabel('number');
ylabel('SINR');
title('SINR bars with 95%-confidence intervals');
legend('SINR', '95%-confidence intervals');
grid on;

figure;
bar(snr);
hold on;
errorbar(1:5, snr, std_snr * ones(1, 5), 'b.', 'LineWidth', 1.5);
xlabel('number');
ylabel('SNR');
title('SNR bars with 95%-confidence intervals');
legend('SNR', '95%-confidence intervals');
grid on;