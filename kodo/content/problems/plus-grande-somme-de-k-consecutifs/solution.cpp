#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    int n, k;
    cin >> n >> k;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    long long somme = 0;
    for (int i = 0; i < k; i++) {         // somme du premier groupe
        somme = somme + t[i];
    }
    long long meilleure = somme;
    int debut = 0;                        // indice où commence le meilleur groupe
    for (int i = 0; i < n - k; i++) {
        somme = somme - t[i] + t[i + k];  // t[i] sort, t[i + k] entre
        if (somme > meilleure) {
            meilleure = somme;
            debut = i + 1;
        }
    }
    cout << meilleure << " " << debut + 1 << "\n";   // position = indice + 1
    return 0;
}
