#include <iostream>
#include <vector>
using namespace std;

int main() {
    long long n, k;
    cin >> n >> k;
    vector<bool> present(n, true);   // present[i] : la personne i + 1 est encore dans le cercle
    int pos = 0;                     // indice de la personne comptée « 1 »
    long long restants = n;
    vector<int> ordre;
    for (int sortie = 0; sortie < n; sortie++) {
        long long s = (k - 1) % restants;   // les tours complets ne changent rien
        while (s > 0) {                     // avancer de s personnes présentes
            pos = (pos + 1) % n;
            if (present[pos]) {
                s = s - 1;
            }
        }
        present[pos] = false;
        ordre.push_back(pos + 1);
        restants = restants - 1;
        if (restants > 0) {                 // la prochaine personne présente sera comptée « 1 »
            while (!present[pos]) {
                pos = (pos + 1) % n;
            }
        }
    }
    for (int x : ordre) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
