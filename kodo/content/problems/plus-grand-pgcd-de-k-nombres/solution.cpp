#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> valeurs(n);
    int M = 0;
    for (int i = 0; i < n; i++) {
        cin >> valeurs[i];
        M = max(M, valeurs[i]);
    }

    vector<int> f(M + 1, 0);       // f[v] = nombre de positions de valeur v
    for (int v : valeurs) {
        f[v]++;
    }

    vector<int> reponse(n + 1, 0);
    int k = 1;
    for (int d = M; d >= 1; d--) {
        int cnt = 0;               // nombre de multiples de d parmi les valeurs
        for (int m = d; m <= M; m += d) {
            cnt += f[m];
        }
        while (k <= n && cnt >= k) {
            reponse[k] = d;        // plus grand d avec au moins k multiples
            k++;
        }
    }

    for (int i = 1; i <= n; i++) {
        cout << reponse[i] << (i < n ? " " : "\n");
    }
    return 0;
}
