#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> duree(n), limite(n), poids(n);
    for (int i = 0; i < n; i++) cin >> duree[i] >> limite[i] >> poids[i];

    int total = 1 << n;
    // fin[m] = instant où se termine le groupe de tâches m, quel que soit l'ordre
    vector<long long> fin(total, 0);
    for (int m = 1; m < total; m++) {
        int j = __builtin_ctz(m);
        fin[m] = fin[m ^ (1 << j)] + duree[j];
    }

    // meilleur[m] = pénalité minimale pour faire d'abord exactement les tâches de m
    vector<long long> meilleur(total, 0);
    for (int m = 1; m < total; m++) {
        long long res = -1;
        for (int j = 0; j < n; j++) {
            if (!((m >> j) & 1)) continue;
            // la tâche j est la dernière du groupe m : elle se termine à l'instant fin[m]
            long long retard = fin[m] - limite[j];
            long long cout_ = meilleur[m ^ (1 << j)] + (retard > 0 ? poids[j] * retard : 0);
            if (res < 0 || cout_ < res) res = cout_;
        }
        meilleur[m] = res;
    }
    cout << meilleur[total - 1] << "\n";
    return 0;
}
