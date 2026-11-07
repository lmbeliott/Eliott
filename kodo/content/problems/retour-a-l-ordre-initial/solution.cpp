#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

const long long MOD = 1000000007;

long long puissance(long long a, int e) {
    long long r = 1;
    while (e-- > 0) r = r * a % MOD;
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> p(n + 1);
    for (int i = 1; i <= n; i++) cin >> p[i];

    // longueurs des cycles de la permutation
    vector<bool> vu(n + 1, false);
    vector<int> longueurs;
    for (int depart = 1; depart <= n; depart++) {
        if (vu[depart]) continue;
        int longueur = 0;
        for (int x = depart; !vu[x]; x = p[x]) {
            vu[x] = true;
            longueur++;
        }
        longueurs.push_back(longueur);
    }

    // crible : plus petit facteur premier de chaque entier jusqu'à N
    vector<int> ppf(n + 1);
    for (int i = 0; i <= n; i++) ppf[i] = i;
    for (int i = 2; (long long)i * i <= n; i++)
        if (ppf[i] == i)
            for (int j = i * i; j <= n; j += i)
                if (ppf[j] == j) ppf[j] = i;

    // PPCM des longueurs : pour chaque nombre premier, le plus grand exposant rencontré
    vector<int> exposant(n + 1, 0);
    for (int longueur : longueurs) {
        int x = longueur;
        while (x > 1) {
            int q = ppf[x], e = 0;
            while (x % q == 0) {
                x /= q;
                e++;
            }
            exposant[q] = max(exposant[q], e);
        }
    }

    long long reponse = 1;
    for (int q = 2; q <= n; q++)
        if (exposant[q] > 0) reponse = reponse * puissance(q, exposant[q]) % MOD;
    cout << reponse << "\n";
    return 0;
}
