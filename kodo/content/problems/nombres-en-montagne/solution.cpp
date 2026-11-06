#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> chiffres(int n) {
    // 1352 -> {1, 3, 5, 2}
    vector<int> liste;
    while (n > 0) {
        liste.push_back(n % 10);
        n = n / 10;
    }
    reverse(liste.begin(), liste.end());
    return liste;
}

bool est_montagne(int n) {
    vector<int> c = chiffres(n);
    int k = c.size();
    // On monte tant que les chiffres augmentent strictement.
    int i = 0;
    while (i + 1 < k && c[i] < c[i + 1]) {
        i++;
    }
    // Le sommet ne doit être ni le premier ni le dernier chiffre.
    if (i == 0 || i == k - 1) {
        return false;
    }
    // Puis on descend tant que les chiffres diminuent strictement.
    while (i + 1 < k && c[i] > c[i + 1]) {
        i++;
    }
    // C'est une montagne si la descente va jusqu'au dernier chiffre.
    return i == k - 1;
}

int main() {
    int a, b;
    cin >> a >> b;
    int total = 0;
    for (int n = a; n <= b; n++) {
        if (est_montagne(n)) {
            total++;
        }
    }
    cout << total << "\n";
    return 0;
}
